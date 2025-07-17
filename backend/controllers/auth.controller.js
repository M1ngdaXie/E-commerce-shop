import jwt from "jsonwebtoken";
import redisClient from "../lib/redis.js";
import User from "../models/user.model.js";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// FIX: Corrected Redis SET syntax for expiration
const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redisClient.set(
      `refreshToken:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60 // 7 days
    );
    console.log(`Token stored in Redis for user: ${userId}`);
  } catch (error) {
    console.error("Error storing refresh token in Redis:", error);
  }
};

// FIX: Export this function so it's available in the module
export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    // Using the exported setCookies function
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = {};

      // Extract validation error messages
      Object.keys(error.errors).forEach((field) => {
        validationErrors[field] = error.errors[field].message;
      });

      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Log the actual error for debugging
    console.error("Signup error:", error);

    // Return a generic error for other types of errors
    res.status(500).json({ message: "Server error" });
  }
};

export const login = (req, res) => {
  res.send("Login route");
};

export const logout = (req, res) => {
  res.send("Logout route");
};
