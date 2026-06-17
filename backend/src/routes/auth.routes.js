import express from "express";
import {
  registerCustomer,
  loginCustomer,
  verifyEmail
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/verify-email", verifyEmail);

export default router;