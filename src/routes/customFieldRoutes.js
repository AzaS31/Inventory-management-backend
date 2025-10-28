import express from "express";
import { customFieldController } from "../api/customFields/customFieldController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/:inventoryId", requireAuth, customFieldController.create);
router.get("/:inventoryId", requireAuth, customFieldController.getAll);
router.put("/:id", requireAuth, customFieldController.update);
router.delete("/:id", requireAuth, customFieldController.delete);

export default router;
