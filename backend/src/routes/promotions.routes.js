import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  togglePromotion,
  deletePromotion
} from "../controllers/promotions.controller.js";

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Acceso solo para administrador"
    });
  }

  next();
}

router.get("/", getActivePromotions);

router.get("/admin/all", authMiddleware, adminOnly, getAllPromotions);
router.post("/admin", authMiddleware, adminOnly, createPromotion);
router.put("/admin/:id", authMiddleware, adminOnly, updatePromotion);
router.put("/admin/:id/toggle", authMiddleware, adminOnly, togglePromotion);
router.delete("/admin/:id", authMiddleware, adminOnly, deletePromotion);

export default router;