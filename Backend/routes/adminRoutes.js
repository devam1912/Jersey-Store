import express from "express";
import {
  getPendingProducts,
  updateProductStatus,
} from "../controllers/adminController.js";

import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* PRODUCTS MODERATION */
router.get("/products/pending", protect, isAdmin, getPendingProducts);
router.put("/products/:id/status", protect, isAdmin, updateProductStatus);

export default router;
