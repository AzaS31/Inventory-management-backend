import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { commentController } from "../api/comments/commentController.js";

const router = express.Router();

router.post("/:inventoryId", requireAuth, commentController.add);
router.get("/:inventoryId", commentController.get);
router.delete("/:commentId", requireAuth, commentController.delete);

export default router;
