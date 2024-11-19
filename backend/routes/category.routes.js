import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import upload from "../config/categoryUpload.config.js";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory, toggleFeatured, toggleActivated, getFeaturedCategories, getActiveCategories } from "../controllers/category.controller.js";

const categoriesRoutes = express.Router();

categoriesRoutes
  .post(
    "/",
    protectedRoute,
    adminRoute,
    upload.single("file"),
    catchAsyncError(createCategory)
  )
  .get("/", catchAsyncError(getCategories))
  .get("/:id", catchAsyncError(getCategory))
  .get("/get/featured", catchAsyncError(getFeaturedCategories))
  .get("/get/active", catchAsyncError(getActiveCategories))
  .put(
    "/:id",
    protectedRoute,
    adminRoute,
    upload.single("file"),
    catchAsyncError(updateCategory)
  )
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
  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteCategory));

export default categoriesRoutes;
