import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,  
    },
    totalSold: {
        type: Number,
        default: 0,
        required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    }
},{timestamps: true});

const Product = mongoose.model("Product", productSchema);
export default Product