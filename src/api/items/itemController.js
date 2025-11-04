import { itemService } from "./itemService.js";

export const itemController = {
    async getAll(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const items = await itemService.getAll(inventoryId);
            res.json(items);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const item = await itemService.getById(id, {
                customValues: {
                    include: { customField: true }
                },
                inventory: true,
                creator: { select: { username: true } },
            });
            return res.json(item);
        } catch (err) {
            next(err);
        }
    },

    async create(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const creatorId = req.user?.id;
            const { itemData, customFieldValues } = req.body;

            const created = await itemService.create(inventoryId, creatorId, itemData, customFieldValues);
            return res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { expectedVersion, updateData, customFieldValues } = req.body;

            const updated = await itemService.update(id, expectedVersion, updateData, customFieldValues);
            return res.json(updated);
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await itemService.delete(id);
            return res.json({ message: "Item deleted successfully." });
        } catch (err) {
            next(err);
        }
    },

    async deleteBatch(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const { ids } = req.body; 
            const result = await itemService.deleteBatch(inventoryId, ids);
            return res.json({ deletedCount: result.count });
        } catch (err) {
            next(err);
        }
    },
};
