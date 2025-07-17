import dotenv from "dotenv";
import express from "express";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
dotenv.config();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5050, () => {
  console.log(`Server is running on port ${process.env.PORT || 5050}`);
  connectDB();
});
