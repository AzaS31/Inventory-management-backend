import prisma from "../../config/database.js";

export const tagService = {
    async assignTagsToInventory(inventoryId, tagNames) {
        const uniqueTags = [...new Set(tagNames.map(t => t.trim()).filter(Boolean))];

        const tags = await Promise.all(
            uniqueTags.map(async (name) => {
                return prisma.tag.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                });
            })
        );

        await prisma.inventoryTag.deleteMany({
            where: { inventoryId },
        });

        const newLinks = tags.map(tag => ({
            inventoryId,
            tagId: tag.id,
        }));

        await prisma.inventoryTag.createMany({
            data: newLinks,
        });

        return tags;
    },

    async getTagsByInventory(inventoryId) {
        return prisma.tag.findMany({
            where: {
                inventories: {
                    some: { inventoryId },
                },
            },
        });
    },

    async getAllTags() {
        return prisma.tag.findMany({
            orderBy: { name: "asc" },
        });
    },

    async searchTags(prefix) {
        return prisma.tag.findMany({
            where: {
                name: {
                    startsWith: prefix,
                    mode: "insensitive",
                },
            },
            orderBy: { name: "asc" },
            take: 10, 
        });
    },
};
