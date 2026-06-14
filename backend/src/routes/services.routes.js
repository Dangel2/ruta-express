import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  getActiveServices,
  getAllServices,
  createService,
  updateService,
  toggleService,
  deleteService
} from "../controllers/services.controller.js";

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Acceso solo para administrador"
    });
  }

  next();
}

router.get("/", getActiveServices);

router.get("/admin/all", authMiddleware, adminOnly, getAllServices);
router.post("/admin", authMiddleware, adminOnly, createService);
router.put("/admin/:id", authMiddleware, adminOnly, updateService);
router.put("/admin/:id/toggle", authMiddleware, adminOnly, toggleService);
router.delete("/admin/:id", authMiddleware, adminOnly, deleteService);

export default router;