import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({
      _id: { $in: req.user.cartItems },
    });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return {
        ...product.toJSON(),
        quantity: item ? item.quantity : 0,
      };
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart products" });
    console.error("Error fetching cart products:", error);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; // Use req.user directly

    // Validate product exists
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ productId, quantity: 1 }); // Initialize quantity
    }

    await user.save();
    res.json({ message: "Product added to cart", cart: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart" });
    console.error("Error adding product to cart:", error);
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.productId !== productId
      );
    }
    await user.save();
    res.json({ message: "Products removed from cart", cart: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error removing products from cart" });
    console.error("Error removing products from cart:", error);
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const item = user.cartItems.find((item) => item.productId === productId);
    if (item) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.productId !== productId
        );
        await user.save();
        return res.json({
          message: "Product removed from cart",
          cart: user.cartItems,
        });
      } else {
        item.quantity = quantity;
        await user.save();
        return res.json({ message: "Cart updated", cart: user.cartItems });
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
    console.error("Error updating cart:", error);
  }
};
