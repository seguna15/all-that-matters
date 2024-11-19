import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { addToCart, fetchCartItems, removeItemFromCart, updateItemQty } from "../controllers/cart.controller.js";


const cartRoute = express.Router();

cartRoute
  .get("/", protectedRoute, catchAsyncError(fetchCartItems))
  .post("/", protectedRoute, catchAsyncError(addToCart))
  .patch("/:productId", protectedRoute, catchAsyncError(updateItemQty))
  .delete("/:productId", protectedRoute, catchAsyncError(removeItemFromCart))

export default cartRoute;

