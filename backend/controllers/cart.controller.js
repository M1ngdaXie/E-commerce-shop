import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    // Use cartItem (singular) and product field
    const productIds = req.user.cartItem.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const cartItems = products.map((product) => {
      const item = req.user.cartItem.find(
        (cartItem) => cartItem.product.toString() === product._id.toString()
      );
      return {
        ...product.toJSON(),
        quantity: item ? item.quantity : 0,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Error fetching cart products" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // NOTE: Using cartItem (singular) and product field
    const existingItem = user.cartItem.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItem.push({ product: productId, quantity: 1 }); // Use product field
    }

    await user.save();
    res.json({ message: "Product added to cart", cart: user.cartItem });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      // Clear entire cart
      user.cartItem = []; // FIXED: cartItem instead of cartItems
    } else {
      // Remove specific product
      user.cartItem = user.cartItem.filter(
        (item) => item.product.toString() !== productId // FIXED: product instead of productId
      );
    }

    await user.save();
    res.json({ message: "Products removed from cart", cart: user.cartItem });
  } catch (error) {
    console.error("Error removing products from cart:", error);
    res.status(500).json({ message: "Error removing products from cart" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // FIXED: use cartItem and product
    const item = user.cartItem.find(
      (item) => item.product.toString() === productId
    );

    if (item) {
      if (quantity === 0) {
        // Remove item from cart
        user.cartItem = user.cartItem.filter(
          (item) => item.product.toString() !== productId
        );
        await user.save();
        return res.json({
          message: "Product removed from cart",
          cart: user.cartItem,
        });
      } else {
        // Update quantity
        item.quantity = quantity;
        await user.save();
        return res.json({ message: "Cart updated", cart: user.cartItem });
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};
