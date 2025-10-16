import express from "express";
import { registerUser, loginUser, getProfile, logout } from "../api/auth/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", requireAuth, getProfile);
router.get("/logout", logout);

export default router;
