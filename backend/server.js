import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./lib/db.js";
import redisClient from "./lib/redis.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Test Redis connection on startup
async function testRedis() {
  try {
    await redisClient.set("test-key", "test-value");
    const value = await redisClient.get("test-key");
    console.log(`Redis test: ${value}`);
  } catch (error) {
    console.error("Redis test failed:", error);
  }
}

testRedis();
app.listen(process.env.PORT || 5050, () => {
  console.log(`Server is running on port ${process.env.PORT || 5050}`);
  connectDB();
});
