import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.util.js";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        maxUsage: {
            type: Number,
            default: 1,
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { 
        timestamps: true, 
        toJSON: { virtuals: true } 
    }
);


couponSchema.pre("validate", function (next) {
  if (this.expirationDate < Date.now()) {
    next(new ErrorHandler("End date cannot be less than today", 400));
  }

  next();
});


const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;