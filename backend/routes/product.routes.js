import express from "express";
import { createProduct, deleteProduct, fetchAllProducts, fetchFeaturedProducts, fetchProduct, getProductsByCategory, getRecommendedProducts, toggleActivated, toggleFeatured, updateProduct } from "../controllers/product.controller.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import upload from "../config/productUpload.config.js";


const productRoute = express.Router();

productRoute
  .get("/", protectedRoute, adminRoute, catchAsyncError(fetchAllProducts))
  .get("/featured-products", catchAsyncError(fetchFeaturedProducts))
  .get("/:id", catchAsyncError(fetchProduct))
  .get("/recommended", catchAsyncError(getRecommendedProducts))
  .get("/category/:category", catchAsyncError(getProductsByCategory))
  .post(
    "/",
    protectedRoute,
    adminRoute,
    upload.array("files"),
    catchAsyncError(createProduct)
  )
  .put("/:id", protectedRoute, adminRoute, upload.array("files"), catchAsyncError(updateProduct))
  .patch(
    "/toggle-featured/:id",
    protectedRoute,
    adminRoute,
    catchAsyncError(toggleFeatured)
  )
  .patch(
    "/toggle-activated/:id",
    protectedRoute,
    adminRoute,
    catchAsyncError(toggleActivated)
  )

  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteProduct));
  

export default productRoute;

