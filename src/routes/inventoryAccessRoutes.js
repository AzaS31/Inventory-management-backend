import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { inventoryAccessController } from "../api/inventoryAccess/inventoryAccessController.js";

const router = express.Router();

router.post("/add", requireAuth, inventoryAccessController.addAccess);
router.get("/search", requireAuth, inventoryAccessController.searchUsers);

router.get("/:inventoryId", requireAuth, inventoryAccessController.getAccessList);
router.delete("/:inventoryId/:userId", requireAuth, inventoryAccessController.removeAccess);

export default router;
