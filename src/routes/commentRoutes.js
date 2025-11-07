import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { commentController } from "../api/comments/commentController.js";

const router = express.Router();

router.post("/comment/:inventoryId", requireAuth, commentController.add);
router.get("/comment/:inventoryId", commentController.get);
router.delete("/comment/:commentId", requireAuth, commentController.delete);

export default router;
