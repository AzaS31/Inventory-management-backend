import prisma from "../../config/database.js";

export const itemLikeRepository = {
    findItemById(itemId) {
        return prisma.item.findUnique({ where: { id: itemId } });
    },

    findLike(itemId, userId) {
        return prisma.itemLike.findUnique({ where: { itemId_userId: { itemId, userId } } });
    },

    createLike(itemId, userId) {
        return prisma.itemLike.create({ data: { itemId, userId } });
    },

    deleteLike(id) {
        return prisma.itemLike.delete({ where: { id } });
    },

    incrementItemLikes(itemId) {
        return prisma.item.update({ where: { id: itemId }, data: { likesCount: { increment: 1 } } });
    },

    decrementItemLikes(itemId) {
        return prisma.item.update({ where: { id: itemId }, data: { likesCount: { decrement: 1 } } });
    },

    async runTransaction(actions) {
        return prisma.$transaction(actions);
    },
};
