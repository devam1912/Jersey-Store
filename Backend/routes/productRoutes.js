import express from "express";
import {
  createProduct,
  getAllProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  isShopkeeper,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.post("/", protect, isShopkeeper, createProduct);
router.get("/my-products", protect, isShopkeeper, getMyProducts);
router.put("/:id", protect, isShopkeeper, updateProduct);
router.delete("/:id", protect, isShopkeeper, deleteProduct);

export default router;
