import { authService } from "./authService.js";

export const authController = {
    async register(req, res, next) {
        try {
            const result = await authService.registerUser(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const result = await authService.loginUser(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req, res, next) {
        try {
            const user = await authService.getUserProfile(req.user.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            res.clearCookie("token");
            res.json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    },
}