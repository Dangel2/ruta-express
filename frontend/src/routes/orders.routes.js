import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;