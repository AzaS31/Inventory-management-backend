import express from "express";
import { tagController } from "../api/tags/tagController.js";

const router = express.Router();

router.get("/", tagController.getAll);
router.get("/search", tagController.search);
router.get("/inventory/:inventoryId", tagController.getByInventory);
router.post("/assign", tagController.assign);

export default router;
