import { commentService } from "./commentService.js";

export const commentController = {
    async add(req, res, next) {
        try {
            const { content } = req.body;
            const { inventoryId } = req.params;
            const userId = req.user.id;

            const comment = await commentService.create(inventoryId, userId, content);
            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    },

    async get(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const comments = await commentService.getByInventoryId(inventoryId);
            res.json(comments);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;

            const result = await commentService.delete(commentId, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
