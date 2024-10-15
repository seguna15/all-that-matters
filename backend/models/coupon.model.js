import mongoose from "mongoose";

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

//check if coupon is expired;
/* couponSchema.virtual('isExpired').get(function () {
    return this.expirationDate < Date.now();
});

couponSchema.virtual('daysLeft').get(function () {
    const daysLeft = `${Math.ceil((this.expirationDate - Date.now()) / (1000 * 60 * 60 * 24))} Days left `
    return daysLeft
});
 */
couponSchema.pre("validate", function (next) {
  if (this.expirationDate < Date.now()) {
    next(new ErrorHandler("End date cannot be  less than today", 400));
  }

  next();
});


const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;