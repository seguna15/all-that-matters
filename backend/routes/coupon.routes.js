import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import { createCoupon, deleteCoupon, fetchActiveCoupons, fetchAllCoupon, getCoupon, toggleActivation, updateCoupon, validateCoupon } from "../controllers/coupon.controller.js";



const couponRoute = express.Router();

couponRoute
  .get("/", protectedRoute, adminRoute, catchAsyncError(fetchAllCoupon))
  .get("/fetch-single/:id", protectedRoute, adminRoute, catchAsyncError(getCoupon))
  .get("/active", catchAsyncError(fetchActiveCoupons))
  .post("/validate", protectedRoute, catchAsyncError(validateCoupon))
  .post("/", protectedRoute, adminRoute, catchAsyncError(createCoupon))
  .put("/:id", protectedRoute, adminRoute, catchAsyncError(updateCoupon))
  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteCoupon))
  .patch("/toggle-activation/:id", protectedRoute, adminRoute, catchAsyncError(toggleActivation));
  
  

export default couponRoute;

