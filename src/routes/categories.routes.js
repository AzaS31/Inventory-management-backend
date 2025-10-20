import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../api/categories/categories.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", requireAuth, requireRole("ADMIN"), createCategory);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCategory);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCategory);

export default router;
