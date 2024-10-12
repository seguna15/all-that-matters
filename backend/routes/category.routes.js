import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import adminRoute from "../middlewares/adminRoute.middleware.js";
import upload from "../config/categoryUpload.config.js";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

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
  .put("/:id", protectedRoute, adminRoute, upload.single("file"), catchAsyncError(updateCategory))
  .delete("/:id", protectedRoute, adminRoute, catchAsyncError(deleteCategory));

export default categoriesRoutes;
