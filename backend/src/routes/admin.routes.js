import express from "express";
import {
  loginAdmin,
  getAllOrders,
  updateAdminOrderStatus,
  getAllCustomers,
  getDashboardStats
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acceso solo para administrador" });
  }

  next();
}

router.post("/login", loginAdmin);

router.get("/orders", authMiddleware, adminOnly, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminOnly, updateAdminOrderStatus);
router.get("/customers", authMiddleware, adminOnly, getAllCustomers);
router.get("/dashboard", authMiddleware, adminOnly, getDashboardStats);

export default router;