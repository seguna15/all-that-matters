import express from "express";
import cors from "cors";
import dbConnect from "../config/dbConnect.config.js";
import cookieParser from "cookie-parser";
import notFoundErrHandler from "../middlewares/notFoundErrorHandler.middleware.js";
import globalErrHandler from "../middlewares/globalErrorHandler.middleware.js";
import authRoute from "../routes/auth.routes.js";
import userRoute from "../routes/user.routes.js";
import productRoute from "../routes/product.routes.js";
import cartRoute from "../routes/cart.routes.js";
import couponRoute from "../routes/coupon.routes.js";
import categoriesRoutes from "../routes/category.routes.js";
import orderRoute from "../routes/order.routes.js";
import analyticsRoute from "../routes/analytics.routes.js";
import brandsRoutes from "../routes/brand.routes.js";

//db Connect
dbConnect();
const app = express();


//cors
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

//pass incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
//routes
const API_VERSION = process.env.API_VERSION

app.use(`${API_VERSION}/uploads`, express.static("uploads/"));

app.use(`${API_VERSION}/auth`, authRoute);
app.use(`${API_VERSION}/users`, userRoute);
app.use(`${API_VERSION}/products`, productRoute);
app.use(`${API_VERSION}/carts`, cartRoute)
app.use(`${API_VERSION}/coupons`, couponRoute)
app.use(`${API_VERSION}/categories`, categoriesRoutes)
app.use(`${API_VERSION}/brands`, brandsRoutes)
app.use(`${API_VERSION}/orders`, orderRoute)
app.use(`${API_VERSION}/analytics`, analyticsRoute)


//err middleware
app.use(notFoundErrHandler);
app.use(globalErrHandler);

export default app;
