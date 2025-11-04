import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { inventoryAccessController } from "../api/inventoryAccess/inventoryAccessController.js";

const router = express.Router();

router.post("/", requireAuth, inventoryAccessController.addAccess);
router.get("/:inventoryId", requireAuth, inventoryAccessController.getAccessList);
router.delete("/:inventoryId/:userId", requireAuth, inventoryAccessController.removeAccess);

export default router;
