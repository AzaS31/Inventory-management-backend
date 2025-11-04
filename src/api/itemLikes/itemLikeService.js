import prisma from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../utils/errors.js";

export const itemLikeService = {
    async toggleLike(itemId, userId) {
        if (!itemId || !userId) {
            throw new BadRequestError("Item ID and User ID are required.");
        }

        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundError("Item not found.");
        }

        const existingLike = await prisma.itemLike.findUnique({
            where: { itemId_userId: { itemId, userId } },
        });

        if (existingLike) {
            await prisma.$transaction([
                prisma.itemLike.delete({ where: { id: existingLike.id } }),
                prisma.item.update({
                    where: { id: itemId },
                    data: { likesCount: { decrement: 1 } },
                }),
            ]);
            return { message: "Unliked successfully.", liked: false };
        } else {
            await prisma.$transaction([
                prisma.itemLike.create({ data: { itemId, userId } }),
                prisma.item.update({
                    where: { id: itemId },
                    data: { likesCount: { increment: 1 } },
                }),
            ]);
            return { message: "Liked successfully.", liked: true };
        }
    },

    async isItemLikedByUser(itemId, userId) {
        const like = await prisma.itemLike.findUnique({
            where: { itemId_userId: { itemId, userId } },
        });
        return !!like;
    },
};
