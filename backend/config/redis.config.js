import Redis from "ioredis"
import logger from "../logger/logger.js";

export const redis = new Redis(process.env.REDIS_URL);


redis.on("ready", () => {
  logger.info("Redis Connected!");
});

redis.on("error", (err) => {
  logger.error("Error in the connection", err);
});
