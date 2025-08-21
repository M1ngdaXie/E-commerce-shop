import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./lib/db.js";
import analyticsRoutes from "./routes/analytics.route.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
dotenv.config();
const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(process.env.PORT || 5050, () => {
  console.log(`Server is running on port ${process.env.PORT || 5050}`);
  connectDB();
});

// # Add this to your server.js temporarily
console.log(
  "REDIS_URL:",
  process.env.REDIS_URL ? "Set (masked for security)" : "Not set"
);

// Add this after dotenv.config()
console.log("Environment check:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- CLIENT_URL:", process.env.CLIENT_URL);
console.log(
  "- STRIPE_SECRET_KEY:",
  process.env.STRIPE_SECRET_KEY
    ? "Set (starts with " +
        process.env.STRIPE_SECRET_KEY.substring(0, 7) +
        "...)"
    : "Not set"
);
