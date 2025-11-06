import prisma from "../../config/database.js";

export const tagRepository = {
    async upsertTag(name) {
        return prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    },

    async deleteInventoryTags(inventoryId) {
        return prisma.inventoryTag.deleteMany({ where: { inventoryId } });
    },

    async createInventoryTags(data) {
        return prisma.inventoryTag.createMany({ data });
    },

    async findTagsByInventory(inventoryId) {
        return prisma.tag.findMany({
            where: { inventories: { some: { inventoryId } } },
        });
    },

    async findAllTags() {
        return prisma.tag.findMany({ orderBy: { name: "asc" } });
    },

    async searchTagsByPrefix(prefix, limit = 10) {
        return prisma.tag.findMany({
            where: { name: { startsWith: prefix, mode: "insensitive" } },
            orderBy: { name: "asc" },
            take: limit,
        });
    },
};
