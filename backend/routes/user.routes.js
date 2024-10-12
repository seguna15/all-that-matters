import express from "express";
import { getAllCustomers, getUserProfile, updateShippingAddress } from "../controllers/user.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";

const userRoute = express.Router();

userRoute
  .get("/get-user-profile", protectedRoute, catchAsyncError(getUserProfile))
  .get("/customers", protectedRoute, adminRoute, catchAsyncError(getAllCustomers))
  .patch("/update/shipping", protectedRoute, catchAsyncError(updateShippingAddress))
 
export default userRoute;

