import express from "express";
import { itemController } from "../api/items/itemController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/:inventoryId/items", itemController.getAll);
router.get("/:inventoryId/items/:id", itemController.getById);
router.post("/:inventoryId/items", requireAuth, itemController.create);
router.put("/:inventoryId/items/:id", requireAuth, itemController.update);
router.delete("/:inventoryId/items/:id", requireAuth, itemController.delete);
router.post("/:inventoryId/items/delete-batch", requireAuth, itemController.deleteBatch);

export default router;
