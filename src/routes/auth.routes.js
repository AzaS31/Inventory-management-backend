import express from "express";
import { registerUser, loginUser, getProfile, logout } from "../api/auth/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { config } from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";

config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", requireAuth, getProfile);
router.get("/logout", logout);

// === GOOGLE AUTH ===
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        try {
            const token = jwt.sign(
                {
                    id: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
        } catch (error) {
            console.error("Error creating Google JWT:", error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);

// === FACEBOOK AUTH ===
router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { session: false, failureRedirect: "/" }),
    (req, res) => {
        try {
            const token = jwt.sign(
                {
                    id: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
        } catch (error) {
            console.error("Error creating Facebook JWT:", error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);
export default router;
