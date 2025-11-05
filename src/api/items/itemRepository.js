import prisma from "../../config/database.js";

export const itemRepository = {
    findAllByInventory(inventoryId) {
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

    findById(itemId, include = {}) {
        return prisma.item.findUnique({ where: { id: itemId }, include });
    },

    findInventory(inventoryId) {
        return prisma.inventory.findUnique({
            where: { id: inventoryId },
            select: { customIdFormat: true },
        });
    },

    create(itemData, customFieldValues) {
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

    update(itemId, expectedVersion, updateData, customFieldValues) {
        return prisma.item.update({
            where: { id: itemId, version: expectedVersion },
            data: {
                ...updateData,
                version: { increment: 1 },
                customValues: {
                    upsert: customFieldValues.map(cv => ({
                        where: { itemId_customFieldId: { itemId, customFieldId: cv.customFieldId } },
                        update: { value: cv.value },
                        create: { customFieldId: cv.customFieldId, value: cv.value },
                    })),
                },
            },
        });
    },

    delete(itemId) {
        return prisma.item.delete({ where: { id: itemId } });
    },

    deleteMany(inventoryId, itemIds) {
        return prisma.item.deleteMany({
            where: { inventoryId, id: { in: itemIds } },
        });
    },
};
