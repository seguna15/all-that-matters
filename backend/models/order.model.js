import mongoose from "mongoose";
import genRandomNumber from "../utils/genRandomNum.util.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        boughtQty: {
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
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    saving: {
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
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    paymentSessionID: {
      type: String,
      unique: true,
    },
    paymentProvider: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    coupon: {
      code: {
        type: String,
      },
      percentage: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);

export default Order;