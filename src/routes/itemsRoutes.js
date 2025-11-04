import express from "express";
import { itemController } from "../api/items/itemController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/:inventoryId", itemController.getAll);
router.get("/:inventoryId/:id", itemController.getById);
router.post("/:inventoryId/items", requireAuth, itemController.create);
router.put("/:inventoryId/:id", requireAuth, itemController.update);
router.delete("/:inventoryId/:id", requireAuth, itemController.delete);
router.post("/:inventoryId/delete-batch", requireAuth, itemController.deleteBatch);

export default router;
