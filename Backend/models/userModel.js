import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "shopkeeper", "admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
