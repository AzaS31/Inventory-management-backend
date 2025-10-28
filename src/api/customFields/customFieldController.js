import { customFieldService } from "./customFieldService.js";

export const customFieldController = {
    async create(req, res) {
        try {
            const { inventoryId } = req.params;
            const newField = await customFieldService.create(inventoryId, req.body);
            res.status(201).json(newField);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const { inventoryId } = req.params;
            const fields = await customFieldService.getAll(inventoryId);
            res.json(fields);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await customFieldService.update(id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            await customFieldService.delete(id);
            res.json({ message: "Custom field deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};
