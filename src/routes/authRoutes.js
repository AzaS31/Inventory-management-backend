import express from "express";
import { authController } from "../api/auth/authController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { config } from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";

config();

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", requireAuth, authController.getProfile);
router.get("/logout", authController.logout);

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
