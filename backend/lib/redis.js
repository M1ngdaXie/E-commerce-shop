import dotenv from "dotenv";
import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Create Redis client
let redisClient;

try {
  // Use direct Upstash URL as fallback if environment variable isn't available
  const redisUrl =
    process.env.REDIS_URL ||
    "redis://default:AeBFAAIncDE0YTJlMzA3MDM0Yzk0YmNmOGRmNmEwOTYwNWQwMzE0MnAxNTc0MTM@civil-macaw-57413.upstash.io:6379";

  redisClient = new Redis(redisUrl);

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  // Verify connection works
  redisClient
    .ping()
    .then(() => {
      console.log("Redis server responded to PING");
    })
    .catch((err) => {
      console.error("Redis PING failed:", err);
    });
} catch (error) {
  console.error("Failed to initialize Redis client:", error);
  // Create dummy client for graceful failure
  redisClient = {
    set: async () => console.error("Redis not connected: set operation failed"),
    get: async () => null,
    del: async () => console.error("Redis not connected: del operation failed"),
  };
}

export default redisClient;
