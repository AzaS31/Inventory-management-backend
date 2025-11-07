import prisma from "../../config/database.js";

export const inventoryAccessRepository = {
    async findByInventoryId(inventoryId) {
        return prisma.inventoryAccess.findMany({
            where: { inventoryId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
    },

    async findUserByEmailOrUsername(identifier) {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
        });
    },

    async searchUsersByQuery(query) {
        return prisma.user.findMany({
            where: {
                OR: [
                    { username: { startsWith: query, mode: "insensitive" } },
                    { email: { startsWith: query, mode: "insensitive" } },
                ],
            },
            select: { id: true, username: true, email: true },
            take: 10, 
        });
    },

    async upsertAccess(inventoryId, userId) {
        return prisma.inventoryAccess.upsert({
            where: { inventoryId_userId: { inventoryId, userId } },
            update: {},
            create: { inventoryId, userId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
    },

    async deleteAccess(inventoryId, userId) {
        return prisma.inventoryAccess.delete({
            where: { inventoryId_userId: { inventoryId, userId } },
        });
    },
};
