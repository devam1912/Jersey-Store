import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String, 
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["Embroidery", "Sublimation", "Heat-Pressed"],
      default: "Embroidery",
    },

    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    shopkeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
