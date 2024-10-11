import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";

const userRoute = express.Router();

userRoute
  .get("/get-user-profile", protectedRoute, catchAsyncError(getUserProfile))
 
export default userRoute;

