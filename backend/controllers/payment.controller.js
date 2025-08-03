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
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}

export const checkSuccess = async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }
      const products = JSON.parse(session.metadata.products || "[]");
      const newOrder = new Order({
        userId: session.metadata.userId,
        products: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        paymentIntent: session.payment_intent,
        stripeSessionId: session_id,
      });
      await newOrder.save();
      return res.status(200).json({
        success: true,
        message: "Payment successful and order created",
        orderId: newOrder._id,
        session,
      });
    }

    res.status(404).json({ message: "Session not found or not paid" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving session", error });
    console.error("Error retrieving session:", error);
  }
};
