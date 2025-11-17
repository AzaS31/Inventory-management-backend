import express from "express";
import { inventoryExternalController } from "../external/inventory/inventoryExternalController.js";

const router = express.Router();

router.get("/:token", inventoryExternalController.getAggregatedInventoryByToken);

export default router;