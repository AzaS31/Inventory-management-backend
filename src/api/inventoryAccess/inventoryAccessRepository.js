import prisma from "../../config/database.js";

export const inventoryAccessRepository = {
    async findByInventoryId(inventoryId) {
        return prisma.inventoryAccess.findMany({
            where: { inventoryId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
    },

    async findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
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
