import * as itemService from "./items.service.js";

export const getItems = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const items = await itemService.getItemsByInventory(inventoryId);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getItemById = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await itemService.getItem(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createItem = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const newItem = await itemService.createItem(inventoryId, req.body);
        res.status(201).json(newItem);
    } catch (err) {
        const status = err.message.includes("Duplicate") ? 409 : 400;
        res.status(status).json({ error: err.message });
    }
};

export const updateItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const updatedItem = await itemService.updateItem(itemId, req.body);
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        await itemService.deleteItem(itemId);
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
