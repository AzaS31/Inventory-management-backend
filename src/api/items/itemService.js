import { itemRepository } from "./itemRepository.js";
import { generateCustomId } from "../../utils/customIdGenerator.js";
import { NotFoundError, ConflictError } from "../../utils/errors.js";

export const itemService = {
    async getAll(inventoryId) {
        return itemRepository.findAllByInventory(inventoryId);
    },

    async getById(itemId, inventoryId) {
        const item = await itemRepository.findById(itemId, inventoryId);
        if (!item) throw new NotFoundError(`Item with ID ${itemId} not found in inventory ${inventoryId}.`);
        return item;
    },

    async create(inventoryId, creatorId, itemData, customFieldValues) {
        const inventory = await itemRepository.findInventory(inventoryId);
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
                const newItem = await itemRepository.create(
                    { ...itemData, inventoryId, creatorId, customId },
                    customFieldValues
                );
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
            return await itemRepository.update(itemId, expectedVersion, updateData, customFieldValues);
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
            await itemRepository.delete(itemId);
        } catch (error) {
            if (error.code === "P2025") throw new NotFoundError(`Item with ID ${itemId} not found.`);
            throw error;
        }
    },

    async deleteBatch(inventoryId, itemIds = []) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) return { count: 0 };
        return itemRepository.deleteMany(inventoryId, itemIds);
    },
};
