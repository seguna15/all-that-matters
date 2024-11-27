import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import { createUnit, deleteUnit, getUnit, getUnits, updateUnit } from "../controllers/unit.controller.js";


const unitsRoutes = express.Router();

unitsRoutes
  .post(
    "/",
    protectedRoute,
    adminRoute,
    catchAsyncError(createUnit)
  )
  .get("/", catchAsyncError(getUnits))
  .get("/:id", catchAsyncError(getUnit))
  .put("/:id", protectedRoute, adminRoute, catchAsyncError(updateUnit))
  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteUnit));

export default unitsRoutes;
