import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.put("/me/password", authMiddleware, changeMyPassword);

export default router;
