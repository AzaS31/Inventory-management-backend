import prisma from "../../config/database.js";

export const commentRepository = {
    create({ content, inventoryId, authorId }) {
        return prisma.comment.create({
            data: { content, inventoryId, authorId },
            include: { author: { select: { id: true, username: true } } },
        });
    },

    findByInventoryId(inventoryId) {
        return prisma.comment.findMany({
            where: { inventoryId },
            include: { author: { select: { id: true, username: true } } },
            orderBy: { createdAt: "desc" },
        });
    },

    findById(commentId) {
        return prisma.comment.findUnique({ where: { id: commentId } });
    },

    deleteById(commentId) {
        return prisma.comment.delete({ where: { id: commentId } });
    },
};
