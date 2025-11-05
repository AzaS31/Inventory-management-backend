import prisma from "../../config/database.js";

export const tagRepository = {
    upsertTag(name) {
        return prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    },

    deleteInventoryTags(inventoryId) {
        return prisma.inventoryTag.deleteMany({ where: { inventoryId } });
    },

    createInventoryTags(data) {
        return prisma.inventoryTag.createMany({ data });
    },

    findTagsByInventory(inventoryId) {
        return prisma.tag.findMany({
            where: { inventories: { some: { inventoryId } } },
        });
    },

    findAllTags() {
        return prisma.tag.findMany({ orderBy: { name: "asc" } });
    },

    searchTagsByPrefix(prefix, limit = 10) {
        return prisma.tag.findMany({
            where: { name: { startsWith: prefix, mode: "insensitive" } },
            orderBy: { name: "asc" },
            take: limit,
        });
    },
};
