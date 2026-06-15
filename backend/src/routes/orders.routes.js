import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id/cancel", authMiddleware, cancelMyOrder);

router.put("/:id/status", updateOrderStatus);

export default router;