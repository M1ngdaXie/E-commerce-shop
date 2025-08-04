import express from "express";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.status(200).json({ analyticsData, dailySalesData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching analytics data", error: error.message });
    console.error("Error fetching analytics data:", error);
  }
});

export default router;
