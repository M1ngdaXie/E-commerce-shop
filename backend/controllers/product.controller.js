import cloudinary from "../lib/cloudinary.js";
import redisClient from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redisClient.get("featured_products");
    if (featuredProducts) {
      featuredProducts = JSON.parse(featuredProducts);
      return res.status(200).json(featuredProducts);
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //store in redis for
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured products" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      imageUrl: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
    console.error(error);
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary:", publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommended products" });
    console.error("Error fetching recommended products:", error);
  }
};
export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in category: ${category}` });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category" });
    console.error("Error fetching products by category:", error);
  }
};
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    await updateFeaturedProductsCache();

    res.status(200).json({ message: "Product featured status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating featured status" });
    console.error("Error updating featured status:", error);
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
    console.log("Featured products cache updated");
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
}
