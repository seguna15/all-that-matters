import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import { createCheckoutSession, updatePaymentStatus } from "../controllers/order.controller.js";


const orderRoute = express.Router();

orderRoute
  .post("/create-checkout-session", protectedRoute, catchAsyncError(createCheckoutSession))
  .patch("/update-payment-status/:id", protectedRoute, catchAsyncError(updatePaymentStatus))
  .patch("/update-shipping-status/:id", protectedRoute, adminRoute, catchAsyncError())

export default orderRoute;

