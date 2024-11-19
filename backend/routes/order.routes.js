import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import { createCheckoutSession, getAllCustomerOrders, getAllOrders, getOrder, paymentCancel, paymentSuccess, paystackWebHook, updatePaymentStatus, updateShippingStatus } from "../controllers/order.controller.js";


const orderRoute = express.Router();

orderRoute
  .get("/", protectedRoute, adminRoute, catchAsyncError(getAllOrders))
  .get("/customer-orders", protectedRoute, catchAsyncError(getAllCustomerOrders))
  .get("/get/:id", protectedRoute, catchAsyncError(getOrder))
  .post(
    "/create-checkout-session", protectedRoute,  catchAsyncError(createCheckoutSession)
  )
  .get("/payment-success", catchAsyncError(paymentSuccess))
  .get("/payment-cancelled", catchAsyncError(paymentCancel))
  .post("/paystack/webhook", catchAsyncError(paystackWebHook))
  .patch(
    "/update-payment-status/:id",
    protectedRoute,
    catchAsyncError(updatePaymentStatus)
  )
  .patch(
    "/update-status/shipping/:id",
    protectedRoute,
    adminRoute,
    catchAsyncError(updateShippingStatus)
  );

export default orderRoute;

