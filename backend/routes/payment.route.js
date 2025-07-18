import express from "express";
import {
  checkSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkSuccess);

export default router;
