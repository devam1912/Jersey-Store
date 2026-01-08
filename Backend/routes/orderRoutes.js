import express from "express";
import {
  createOrder,
  getMyOrders,
  getShopkeeperOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

import {
  protect,
  isCustomer,
  isShopkeeper,
  isAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// CUSTOMER 
router.post("/", protect, isCustomer, createOrder);
router.get("/my-orders", protect, isCustomer, getMyOrders);

// SHOPKEEPER 
router.get("/shopkeeper", protect, isShopkeeper, getShopkeeperOrders);
router.put("/:id/status", protect, isShopkeeper, updateOrderStatus);

// ADMIN 
router.get("/", protect, isAdmin, getAllOrders);

export default router;
