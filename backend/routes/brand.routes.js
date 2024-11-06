import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import { createBrand, deleteBrand, getBrand, getBrands, updateBrand } from "../controllers/brand.controller.js";


const brandsRoutes = express.Router();

brandsRoutes
  .post(
    "/",
    protectedRoute,
    adminRoute,
    catchAsyncError(createBrand)
  )
  .get("/", catchAsyncError(getBrands))
  .get("/:id", catchAsyncError(getBrand))
  .put("/:id", protectedRoute, adminRoute, catchAsyncError(updateBrand))
  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteBrand));

export default brandsRoutes;
