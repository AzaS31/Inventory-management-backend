import express from "express";
import { itemLikeController } from "../api/itemLikes/itemLikeController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/:itemId/toggle-like", requireAuth, itemLikeController.toggleLike);
router.get("/:itemId/is-liked", requireAuth, itemLikeController.isItemLikedByUser);

export default router;
