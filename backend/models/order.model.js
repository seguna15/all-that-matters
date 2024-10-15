import mongoose from "mongoose";
import genRandomNumber from "../utils/genRandomNum.util.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNum: {
      type: String,
      required: true,
      default: await genRandomNumber(),
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "delivered"],
    },
    stripeSessionId: {
        type: String,
        unique: true,
    }
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);

export default Order;