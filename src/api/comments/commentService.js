import prisma from "../../config/database.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/errors.js";

export const commentService = {
    async create(inventoryId, userId, content) {
        if (!content || content.trim().length === 0) {
            throw new BadRequestError("The comment cannot be empty.");
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                inventoryId,
                authorId: userId,
            },
            include: {
                author: { select: { id: true, username: true } },
            },
        });

        return comment;
    },

    async getByInventoryId(inventoryId) {
        const comments = await prisma.comment.findMany({
            where: { inventoryId },
            include: {
                author: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return comments;
    },

    async delete(commentId, userId) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new NotFoundError("Comment not found.");
        }

        if (comment.authorId !== userId) {
            throw new UnauthorizedError("You are not allowed to delete this comment.");
        }

        await prisma.comment.delete({ where: { id: commentId } });
        return { message: "Comment deleted successfully." };
    },
};
