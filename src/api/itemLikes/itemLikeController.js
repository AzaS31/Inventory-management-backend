import { itemLikeService } from "./itemLikeService.js";

export const itemLikeController = {
    async toggleLike(req, res, next) {
        try {
            const { itemId } = req.params;
            const userId = req.user.id;

            const result = await itemLikeService.toggleLike(itemId, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async isItemLikedByUser(req, res, next) {
        try {
            const { itemId } = req.params;
            const userId = req.user.id;

            const isLiked = await itemLikeService.isItemLikedByUser(itemId, userId);
            res.json({ isLiked });
        } catch (error) {
            next(error);
        }
    },
};
