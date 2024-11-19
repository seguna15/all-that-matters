import ErrorHandler from "./ErrorHandler.util.js";
import { redis } from "../config/redis.config.js";
import Coupon from "../models/coupon.model.js";



export const validateDBCoupon = async (coupon) => {
  
   
}


export const updateActiveCouponCache = async () => {
  const activeCoupons = await Coupon.find({ isActive: true })
    .sort({
      expirationDate: 1,
    })
    .lean();
  await redis.set("active_coupons", JSON.stringify(activeCoupons));
};