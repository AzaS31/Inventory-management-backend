import prisma from "../../config/database.js";

export const itemLikeRepository = {
    async findItemById(itemId) {
        return prisma.item.findUnique({ where: { id: itemId } });
    },

    async findLike(itemId, userId) {
        return prisma.itemLike.findUnique({ where: { itemId_userId: { itemId, userId } } });
    },

    async createLike(itemId, userId) {
        return prisma.itemLike.create({ data: { itemId, userId } });
    },

    async deleteLike(id) {
        return prisma.itemLike.delete({ where: { id } });
    },

    async incrementItemLikes(itemId) {
        return prisma.item.update({ where: { id: itemId }, data: { likesCount: { increment: 1 } } });
    },

    async decrementItemLikes(itemId) {
        return prisma.item.update({ where: { id: itemId }, data: { likesCount: { decrement: 1 } } });
    },

    async runTransaction(actions) {
        return prisma.$transaction(actions);
    },
};
