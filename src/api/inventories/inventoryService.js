import { inventoryRepository } from "./inventoryRepository.js";
import { BadRequestError, NotFoundError, UnauthorizedError, ConflictError } from "../../utils/errors.js";

export const inventoryService = {
    async getLatest(limit = 10) {
        return inventoryRepository.findLatest(limit);
    },

    async getTopFive() {
        return inventoryRepository.findTopFive();
    },

    async getInventoriesById(userId) {
        return inventoryRepository.findByOwner(userId);
    },

    async getAccessibleInventoriesById(userId) {
        return inventoryRepository.findAccessible(userId);
    },

    async getInventoryById(id) {
        const inventory = await inventoryRepository.findById(id);
        if (!inventory) throw new NotFoundError("Inventory not found");
        return inventory;
    },

    async create(data) {
        const { title, ownerId, description, isPublic, categoryId, customIdFormat } = data;
        if (!title || !ownerId) throw new BadRequestError("Title and ownerId are required.");

        try {
            return await inventoryRepository.create({ title, ownerId, description, isPublic, categoryId: categoryId || null, customIdFormat });
        } catch (error) {
            if (error.code === "P2002") throw new ConflictError("Inventory with the same title already exists.");
            throw error;
        }
    },

    async update(id, expectedVersion, updates, user) {
        const existing = await inventoryRepository.findById(id);
        if (!existing) throw new NotFoundError("Inventory not found");

        const isOwner = existing.ownerId === user.id;
        const isAdmin = user.role?.name === "ADMIN";

        if (!isOwner && !isAdmin)
            throw new UnauthorizedError("You are not authorized to edit this inventory.");

        try {
            const data = {
                ...updates,
                updatedAt: new Date(),
            };

            return await inventoryRepository.update(id, expectedVersion, data);
        } catch (error) {
            if (error.code === "P2025") {
                throw new ConflictError("The inventory has been modified by another user. Please reload and try again.");
            }

            if (error.code === "P2002" && error.meta?.target?.includes("title")) {
                throw new ConflictError(`Inventory title '${updates.title}' already exists.`);
            }

            throw error;
        }
    },

    async delete(id, userId, isAdmin = false) {
        const existing = await inventoryRepository.findById(id);
        if (!existing) throw new NotFoundError("Inventory not found");
        if (!isAdmin && existing.ownerId !== userId) throw new UnauthorizedError("You are not authorized to delete this inventory.");

        return inventoryRepository.deleteById(id);
    },

    async deleteBatch(inventoryIds, userId, userRole) {
        const inventories = await inventoryRepository.findByOwner(userId);
        if (userRole !== "ADMIN") {
            const unauthorized = inventories.some(inv => inventoryIds.includes(inv.id) && inv.ownerId !== userId);
            if (unauthorized) throw new UnauthorizedError("You are not authorized to delete some of these inventories.");
        }

        const result = await inventoryRepository.deleteBatch(inventoryIds);
        if (result.count === 0) throw new NotFoundError("No inventories were deleted.");

        return { message: `Deleted ${result.count} inventories successfully.` };
    },

    async updateCustomIdFormat(id, customIdFormat, userId) {
        const existing = await inventoryRepository.findById(id);
        if (!existing) throw new NotFoundError("Inventory not found");

        const isOwner = existing.ownerId === userId;
        const hasEditAccess = existing.accesses.some(a => a.user.id === userId);

        if (!isOwner && !hasEditAccess) throw new UnauthorizedError("You are not authorized to update custom ID format.");

        return inventoryRepository.update(id, { customIdFormat, updatedAt: new Date() });
    },
};
