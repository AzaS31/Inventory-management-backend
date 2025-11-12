import prisma from "../../config/database.js";

export const itemRepository = {
    async findAllByInventory(inventoryId) {
        return prisma.item.findMany({
            where: { inventoryId },
            include: {
                customValues: { include: { customField: { select: { name: true, type: true } } } },
                creator: { select: { username: true } },
                _count: { select: { likes: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async findById(itemId, inventoryId) {
        return prisma.item.findFirst({
            where: {
                id: itemId,
                inventoryId,
            },
            include: {
                customValues: { include: { customField: true } },
                inventory: true,
                creator: { select: { username: true } },
            },
        });
    },

    async findInventory(inventoryId) {
        return prisma.inventory.findUnique({
            where: { id: inventoryId },
            select: { customIdFormat: true },
        });
    },

    async create(itemData, customFieldValues) {
        return prisma.item.create({
            data: {
                ...itemData,
                customValues: {
                    create: customFieldValues.map(cv => ({
                        customFieldId: cv.customFieldId,
                        value: cv.value,
                    })),
                },
            },
        });
    },

    async update(itemId, expectedVersion, updateData, customFieldValues) {
        const customValuesToUpsert = customFieldValues || [];

        return prisma.item.update({
            where: {
                id: itemId,
                version: expectedVersion
            },
            data: {
                ...updateData,
                version: { increment: 1 },
                customValues: {
                    upsert: customValuesToUpsert.map(cv => ({
                        where: { itemId_customFieldId: { itemId, customFieldId: cv.customFieldId } },
                        update: { value: cv.value },
                        create: { customFieldId: cv.customFieldId, value: cv.value },
                    })),
                },
            },
        });
    },

    async delete(itemId) {
        return prisma.item.delete({ where: { id: itemId } });
    },

    async deleteMany(inventoryId, itemIds) {
        return prisma.item.deleteMany({
            where: { inventoryId, id: { in: itemIds } },
        });
    },
};
