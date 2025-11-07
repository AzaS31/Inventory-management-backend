import express from "express";
import { categoryController } from "../api/categories/categoryController.js";

const router = express.Router();

router.get("/all", categoryController.getAll);
router.get("/category/:id", categoryController.getById);

export default router;
