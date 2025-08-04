import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    // Add this to ensure proper URL format
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    // Check if baseUrl has a scheme, add if missing
    const formattedBaseUrl = baseUrl.startsWith("http")
      ? baseUrl
      : `http://${baseUrl}`;

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;
    let appliedCouponCode = "";

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
        expirationDate: { $gt: new Date() }, // Check expiration date
      });

      if (coupon) {
        // Fix the discount calculation
        totalAmount = Math.round(
          totalAmount * (1 - coupon.discountPercentage / 100)
        );
        appliedCouponCode = coupon.code;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // Use the formatted URL with scheme
      success_url: `${formattedBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${formattedBaseUrl}/cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: appliedCouponCode,
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // Create new coupon for big spenders
    let newCoupon = null;
    if (totalAmount >= 20000) {
      // $200+
      newCoupon = await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
      newCoupon: newCoupon
        ? {
            code: newCoupon.code,
            discount: newCoupon.discountPercentage,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating checkout session", error });
    console.error("Error creating checkout session:", error);
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const code =
    "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    const newCoupon = new Coupon({
      code,
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      userId,
    });
    await newCoupon.save();
    console.log("Created new coupon:", newCoupon);
    return newCoupon;
  } catch (err) {
    console.error("Error creating new coupon:", err);
    return null;
  }
}

export const checkSuccess = async (req, res) => {
  try {
    // Change parameter name to match friend's code
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Check if an order with this sessionId already exists
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      console.log(
        "Duplicate request detected: Order already exists for this sessionId:",
        sessionId
      );
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        orderId: existingOrder._id,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Handle coupon if used
      if (session.metadata && session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      // Parse products and create order
      const products = JSON.parse(session.metadata?.products || "[]");
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      // Clear the user's cart in the database (THIS IS THE KEY ADDITION)
      await Cart.deleteMany({ userId: session.metadata.userId });

      console.log("Order saved successfully:", newOrder._id);
      return res.status(200).json({
        success: true,
        message: "Payment successful and order created",
        orderId: newOrder._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Error processing checkout success:", error);
    res.status(500).json({
      message: "Error processing checkout success",
      error: error.message,
    });
  }
};
