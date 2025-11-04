import { customFieldService } from "./customFieldService.js";

export const customFieldController = {
    async create(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const newField = await customFieldService.create(inventoryId, req.body);
            res.status(201).json(newField);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const { inventoryId } = req.params;
            const fields = await customFieldService.getAll(inventoryId);
            res.json(fields);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await customFieldService.update(id, req.body);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await customFieldService.delete(id);
            res.json({ message: "Custom field deleted" });
        } catch (error) {
            next(error);
        }
    },
};
