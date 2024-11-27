//unit schema
import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", unitSchema);
export default Unit;
