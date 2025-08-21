import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();

console.log("Testing Redis connection...");
console.log("REDIS_URL exists:", !!process.env.REDIS_URL);

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  connectTimeout: 5000,
});

redis.on("connect", () => {
  console.log("✅ Successfully connected to Redis!");
  process.exit(0);
});

redis.on("error", (err) => {
  console.error("❌ Redis connection failed:", err.message);
  process.exit(1);
});

// Exit after 5 seconds if no connection/error event
setTimeout(() => {
  console.error("⏱️ Connection attempt timed out");
  process.exit(1);
}, 5000);
