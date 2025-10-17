import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
    getAllInventories,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
} from "../api/inventories/inventories.controller.js";

const router = express.Router();

router.get("/", getAllInventories);
router.get("/:id", getInventoryById);

router.post("/", requireAuth, createInventory);
router.put("/:id", requireAuth, updateInventory);
router.delete("/:id", requireAuth, deleteInventory);

export default router;
