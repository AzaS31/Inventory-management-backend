import prisma from "../../config/database.js";
import { generateCustomId } from "../../utils/customIdGenerator.js";
import { ConflictError, NotFoundError } from "../../utils/errors.js";

export const itemService = {
    async getAll(inventoryId) {
        const items = await prisma.item.findMany({
            where: { inventoryId },
            include: {
                customValues: {
                    include: { customField: { select: { name: true, type: true } } },
                },
                creator: { select: { username: true } },
                _count: { select: { likes: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return items;
    },

    async getById(itemId, include = {}) {
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            include,
        });

        if (!item) throw new NotFoundError(`Item with ID ${itemId} not found.`);
        return item;
    },

    async create(inventoryId, creatorId, itemData, customFieldValues) {
        const inventory = await prisma.inventory.findUnique({
            where: { id: inventoryId },
            select: { customIdFormat: true },
        });

        if (!inventory) throw new NotFoundError("Inventory not found.");

        const customIdFormat =
            inventory.customIdFormat && Array.isArray(inventory.customIdFormat)
                ? inventory.customIdFormat
                : [{ type: "SEQ", digits: 6 }];

        let customId;
        let attempt = 0;
        const maxAttempts = 3;

        while (attempt < maxAttempts) {
            attempt++;
            customId = await generateCustomId(inventoryId, customIdFormat);

            try {
                const newItem = await prisma.item.create({
                    data: {
                        ...itemData,
                        inventoryId,
                        customId,
                        creatorId,
                        customValues: {
                            create: customFieldValues.map(cv => ({
                                customFieldId: cv.fieldId,
                                value: cv.value,
                            })),
                        },
                    },
                });

                return newItem;
            } catch (error) {
                if (error.code === "P2002" && error.meta?.target?.includes("inventoryId_customId")) {
                    console.warn(`Duplicate customId "${customId}", regenerating...`);
                    continue;
                }
                throw error;
            }
        }

        throw new ConflictError("Failed to generate unique custom ID after several attempts.");
    },

    async update(itemId, expectedVersion, updateData, customFieldValues) {
        try {
            const updatedItem = await prisma.item.update({
                where: {
                    id: itemId,
                    version: expectedVersion,
                },
                data: {
                    ...updateData,
                    version: { increment: 1 },
                    customValues: {
                        upsert: customFieldValues.map(cv => ({
                            where: {
                                itemId_customFieldId: { itemId, customFieldId: cv.fieldId },
                            },
                            update: { value: cv.value },
                            create: { customFieldId: cv.fieldId, value: cv.value },
                        })),
                    },
                },
            });
            return updatedItem;
        } catch (error) {
            if (error.code === "P2025") {
                throw new ConflictError(
                    "The item has been modified by another user. Please reload and try again."
                );
            }

            if (error.code === "P2002" && error.meta?.target?.includes("customId")) {
                throw new ConflictError(
                    `Custom ID '${updateData.customId}' already exists in this inventory.`
                );
            }

            throw error;
        }
    },

    async delete(itemId) {
        try {
            await prisma.item.delete({
                where: { id: itemId },
            });
        } catch (error) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Item with ID ${itemId} not found.`);
            }
            throw error;
        }
    },

    async addLike(itemId, userId) {
        try {
            await prisma.$transaction([
                prisma.itemLike.create({ data: { itemId, userId } }),
                prisma.item.update({
                    where: { id: itemId },
                    data: { likesCount: { increment: 1 } },
                }),
            ]);
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictError("You have already liked this item.");
            }
            throw error;
        }
    },
};
