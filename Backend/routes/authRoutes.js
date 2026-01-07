import express from "express";
import {
  signUp,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logout);

export default router;
