import Redis from "ioredis"


export const redis = new Redis(process.env.REDIS_URL);

/* let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})(); */

