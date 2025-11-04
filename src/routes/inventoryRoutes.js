import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { inventoryController } from "../api/inventories/inventoryController.js";

const router = express.Router();

router.get("/", inventoryController.getAll);
router.get("/top5", inventoryController.getTopFive);
router.get("/my", requireAuth, inventoryController.getMy);
router.get("/shared", requireAuth, inventoryController.getAccessibleToMe);
router.get("/user/:userId", inventoryController.getUserInventoriesById);
router.get("/user/:userId/shared", inventoryController.getUserAccessibleInventoriesById);
router.get("/:id", inventoryController.getInventoryById);

router.post("/", requireAuth, inventoryController.create);
router.put("/:id", requireAuth, inventoryController.update);
router.put("/:id/custom-id-format", requireAuth, inventoryController.updateCustomIdFormat);
router.delete("/:id", requireAuth, inventoryController.deleteById);
router.post("/delete-batch", requireAuth, inventoryController.deleteBatch);

export default router;
