import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";

import adminRoute from "../middlewares/adminRoute.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";


const analyticsRoute = express.Router();

analyticsRoute
  .get("/", protectedRoute, adminRoute, catchAsyncError(getAnalytics))


export default analyticsRoute;

