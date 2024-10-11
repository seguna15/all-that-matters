import express from "express";
import { createProduct, deleteProduct, fetchAllProducts, fetchFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeature } from "../controllers/product.controller.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import upload from "../config/productUpload.config.js";


const productRoute = express.Router();

productRoute
  .get("/", protectedRoute, adminRoute, catchAsyncError(fetchAllProducts))
  .get("/featured-products", catchAsyncError(fetchFeaturedProducts))
  .get("/category/:category", catchAsyncError(getProductsByCategory))
  .get("/toggle-featured/:id", protectedRoute, adminRoute, catchAsyncError(toggleFeature))
  .get("/recommended", catchAsyncError(getRecommendedProducts))
  .post("/", protectedRoute, adminRoute, upload.array("files"), catchAsyncError(createProduct))
  .delete("/:id",protectedRoute, adminRoute, catchAsyncError(deleteProduct) )
  

export default productRoute;

