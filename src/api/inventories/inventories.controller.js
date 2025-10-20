import * as inventoryService from "./inventories.service.js";

export const getAllInventories = async (req, res) => {
    try {
        const inventories = await inventoryService.getAll();
        res.json(inventories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInventoryById = async (req, res) => {
    try {
        const inventory = await inventoryService.getById(req.params.id);
        if (!inventory) return res.status(404).json({ message: "Inventory not found" });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInventory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, isPublic, categoryId } = req.body;

        const newInventory = await inventoryService.create({
            title,
            description,
            isPublic,
            ownerId: userId,
            categoryId,
        });

        res.status(201).json(newInventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const inventory = await inventoryService.update(req.params.id, req.body, req.user.id);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteInventory = async (req, res) => {
    try {
        await inventoryService.remove(req.params.id, req.user.id);
        res.json({ message: "Inventory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
