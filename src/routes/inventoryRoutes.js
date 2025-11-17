import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { inventoryController } from "../api/inventories/inventoryController.js";

const router = express.Router();

router.get("/latest", inventoryController.getLatest);
router.get("/top5", inventoryController.getTopFive);
router.get("/my", requireAuth, inventoryController.getMy);
router.get("/shared", requireAuth, inventoryController.getAccessibleToMe);
router.get("/user/:userId/shared", inventoryController.getUserAccessibleInventoriesById);
router.get("/user/:userId", inventoryController.getUserInventoriesById);
router.get("/sorted", inventoryController.getAllSorted);
router.get("/filtered", inventoryController.getFilteredByCategory);

router.post("/inventory/:id/api-token", requireAuth, inventoryController.generateApiToken);
router.get("/inventory/:id", inventoryController.getInventoryById);
router.post("/inventory/create", requireAuth, inventoryController.create);
router.put("/inventory/:id", requireAuth, inventoryController.update);
router.put("/inventory/:id/custom-id-format", requireAuth, inventoryController.updateCustomIdFormat);
router.delete("/inventory/delete/:id", requireAuth, inventoryController.deleteById);
router.post("/delete-batch", requireAuth, inventoryController.deleteBatch);

export default router;
