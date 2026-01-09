import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controllers/reviewController.js";

import { protect, isCustomer } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* CUSTOMER */
router.post("/", protect, isCustomer, createReview);

/* PUBLIC */
router.get("/:productId", getProductReviews);

export default router;
