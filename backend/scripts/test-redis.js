import redisClient, { testRedisConnection } from "../lib/redis.js";

async function main() {
  try {
    console.log("Testing Redis connection...");
    await testRedisConnection();
    console.log("Redis test complete!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close connection
    await redisClient.quit();
    console.log("Redis connection closed");
  }
}

main();
