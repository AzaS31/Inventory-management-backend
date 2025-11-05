import prisma from "../../config/database.js";

export const inventoryAccessRepository = {
    findByInventoryId(inventoryId) {
        return prisma.inventoryAccess.findMany({
            where: { inventoryId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
    },

    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },

    upsertAccess(inventoryId, userId) {
        return prisma.inventoryAccess.upsert({
            where: { inventoryId_userId: { inventoryId, userId } },
            update: {},
            create: { inventoryId, userId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
    },

    deleteAccess(inventoryId, userId) {
        return prisma.inventoryAccess.delete({
            where: { inventoryId_userId: { inventoryId, userId } },
        });
    },
};
