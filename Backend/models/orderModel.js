import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopkeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    orderStatus: {
      type: String,
      enum: ["placed", "accepted", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    deliveryAddress: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
