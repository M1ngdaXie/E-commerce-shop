import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", protectRoute, adminRoute, getFeaturedProducts);
router.get(
  "/recommendations",
  protectRoute,
  adminRoute,
  getRecommendedProducts
);
router.get(
  "/category/:category",
  protectRoute,
  adminRoute,
  getProductByCategory
);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
