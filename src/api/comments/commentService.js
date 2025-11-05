import { commentRepository } from "./commentRepository.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/errors.js";

export const commentService = {
    async create(inventoryId, userId, content) {
        if (!content || content.trim().length === 0) {
            throw new BadRequestError("The comment cannot be empty.");
        }

        return commentRepository.create({ content, inventoryId, authorId: userId });
    },

    async getByInventoryId(inventoryId) {
        return commentRepository.findByInventoryId(inventoryId);
    },

    async delete(commentId, userId) {
        const comment = await commentRepository.findById(commentId);
        if (!comment) throw new NotFoundError("Comment not found.");
        if (comment.authorId !== userId) throw new UnauthorizedError("You are not allowed to delete this comment.");

        await commentRepository.deleteById(commentId);
        return { message: "Comment deleted successfully." };
    },
};
