import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

export default router;