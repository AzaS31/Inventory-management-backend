import { inventoryService } from "./inventoryService.js";

export const inventoryController = {
    async getLatest(req, res, next) {
        try {
            const inventories = await inventoryService.getLatest();
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getTopFive(req, res, next) {
        try {
            const inventories = await inventoryService.getTopFive();
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getMy(req, res, next) {
        try {
            const userId = req.user.id;
            const inventories = await inventoryService.getInventoriesById(userId);
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getAccessibleToMe(req, res, next) {
        try {
            const userId = req.user.id;
            const inventories = await inventoryService.getAccessibleInventoriesById(userId);
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getUserInventoriesById(req, res, next) {
        try {
            const { userId } = req.params;
            const inventories = await inventoryService.getInventoriesById(userId);
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getUserAccessibleInventoriesById(req, res, next) {
        try {
            const { userId } = req.params;
            const inventories = await inventoryService.getAccessibleInventoriesById(userId);
            res.json(inventories);
        } catch (error) {
            next(error);
        }
    },

    async getInventoryById(req, res, next) {
        try {
            const inventory = await inventoryService.getInventoryById(req.params.id);
            if (!inventory) return res.status(404).json({ message: "Inventory not found" });
            res.json(inventory);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { title, description, isPublic, categoryId, customIdFormat } = req.body;

            const newInventory = await inventoryService.create({
                title,
                description,
                isPublic,
                ownerId: userId,
                categoryId,
                customIdFormat,
            });

            res.status(201).json(newInventory);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { expectedVersion, ...updates } = req.body;

            const updatedInventory = await inventoryService.update(id, expectedVersion, updates, req.user);
            res.json(updatedInventory);
        } catch (error) {
            next(error);
        }
    },

    async deleteById(req, res, next) {
        try {
            const { id } = req.params;
            const isAdmin = req.user.role?.name === 'ADMIN';
            await inventoryService.delete(id, req.user.id, isAdmin);
            res.json({ message: "Inventory deleted successfully" });
        } catch (error) {
            next(error);
        }
    },

    async deleteBatch(req, res, next) {
        try {
            const { ids } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role?.name;

            const result = await inventoryService.deleteBatch(ids, userId, userRole);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async updateCustomIdFormat(req, res, next) {
        try {
            const { id } = req.params;
            const { customIdFormat } = req.body;
            const userId = req.user.id;

            const updated = await inventoryService.updateCustomIdFormat(id, customIdFormat, userId);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    },

    async getAllSorted(req, res, next) {
        try {
            const { sortBy, order } = req.query;
            const inventories = await inventoryService.getSortedInventories(sortBy, order);
            res.json(inventories);
        } catch (err) {
            next(err);
        }
    },

    async getAllSorted(req, res, next) {
        try {
            const { sortBy, order } = req.query;
            const inventories = await inventoryService.getSortedInventories(sortBy, order);
            res.json(inventories);
        } catch (err) {
            next(err);
        }
    },
}
