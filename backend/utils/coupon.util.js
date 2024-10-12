import ErrorHandler from "./ErrorHandler.util.js";
import { redis } from "../config/redis.config.js";
import Coupon from "../models/coupon.model.js";


export const validateCacheCoupon = async(coupons, coupon) => {
  console.log("hits cache")
  if(coupon.expirationDate < Date.now()){
      coupon.isActive = false;
      const activeCoupons = coupons.filter(item => item.code !== coupon.code);
      await redis.set("active_coupons", JSON.stringify(activeCoupons))
      throw new ErrorHandler("Coupon has expired", 400)
  }
}


export const validateDBCoupon = async (coupon) => {
  console.log("hits db");
   if (coupon.expirationDate < Date.now()) {
    
     coupon.isActive = false;
     await coupon.save();
     updateActiveCouponCache();
     throw new ErrorHandler("Coupon has expired", 400);
   }
}


export const updateActiveCouponCache = async () => {
  const activeCoupons = await Coupon.find({ isActive: true })
    .sort({
      expirationDate: 1,
    })
    .lean();
  await redis.set("active_coupons", JSON.stringify(activeCoupons));
};