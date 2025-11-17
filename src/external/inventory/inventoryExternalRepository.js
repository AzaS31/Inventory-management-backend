import prisma from "../../config/database.js";

export const inventoryExternalRepository = {
    async getInventoryWithItemsByToken(token) {
        return prisma.inventory.findUnique({
            where: { apiToken: token },
            include: {
                items: true,
            },
        });
    },
}