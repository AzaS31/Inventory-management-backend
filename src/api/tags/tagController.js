import { tagService } from "./tagService.js";

export const tagController = {
    async getAll(req, res) {
        try {
            const tags = await tagService.getAllTags();
            res.json(tags);
        } catch (error) {
            console.error("Error fetching all tags:", error);
            res.status(500).json({ message: "Failed to get tags" });
        }
    },

    async search(req, res) {
        try {
            const { q } = req.query;
            if (!q || !q.trim()) return res.json([]);
            const tags = await tagService.searchTags(q.trim());
            res.json(tags);
        } catch (error) {
            console.error("Error searching tags:", error);
            res.status(500).json({ message: "Failed to search tags" });
        }
    },

    async getByInventory(req, res) {
        try {
            const { inventoryId } = req.params;
            if (!inventoryId) return res.status(400).json({ message: "inventoryId is required" });
            const tags = await tagService.getTagsByInventory(inventoryId);
            res.json(tags);
        } catch (error) {
            console.error("Error getting tags by inventory:", error);
            res.status(500).json({ message: "Failed to get inventory tags" });
        }
    },

    async assign(req, res) {
        try {
            const { inventoryId, tags } = req.body;

            if (!inventoryId) {
                return res.status(400).json({ message: "inventoryId is required" });
            }

            if (!Array.isArray(tags)) {
                return res.status(400).json({ message: "tags must be an array" });
            }

            const result = await tagService.assignTagsToInventory(inventoryId, tags);
            res.json(result);
        } catch (error) {
            console.error("Error assigning tags:", error);
            res.status(500).json({ message: "Failed to assign tags" });
        }
    },
};
