import express from "express";
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} from "../api/items/items.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/:inventoryId/items", requireAuth, getItems);
router.get("/:inventoryId/items/:itemId", requireAuth, getItemById);
router.post("/:inventoryId/items", requireAuth, createItem);
router.put("/:inventoryId/items/:itemId", requireAuth, updateItem);
router.delete("/:inventoryId/items/:itemId", requireAuth, deleteItem);

export default router;
