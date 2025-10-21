import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
    addAccess,
    removeAccess,
    listAccess,
} from "../api/inventoryAccess/inventoryAccess.controller.js";

const router = express.Router();

router.post("/", requireAuth, addAccess);
router.delete("/:inventoryId/:userId", requireAuth, removeAccess);
router.get("/:inventoryId", requireAuth, listAccess);

export default router;
