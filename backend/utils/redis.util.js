import { redis } from "../config/redis.config.js"

export const setUserCart = async (userId, userCart) => {
    await redis.set(`cart:${userId}`,JSON.stringify(userCart))
}
