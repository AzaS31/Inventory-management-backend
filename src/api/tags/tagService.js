import { tagRepository } from "./tagRepository.js";
import { BadRequestError } from "../../utils/errors.js";

export const tagService = {
    async assignTagsToInventory(inventoryId, tagNames) {
        if (!inventoryId) throw new BadRequestError("Inventory ID is required");

        const uniqueTags = [...new Set(tagNames.map(t => t.trim()).filter(Boolean))];

        const tags = await Promise.all(uniqueTags.map(name => tagRepository.upsertTag(name)));

        await tagRepository.deleteInventoryTags(inventoryId);

        const newLinks = tags.map(tag => ({ inventoryId, tagId: tag.id }));
        await tagRepository.createInventoryTags(newLinks);

        return tags;
    },

    async getTagsByInventory(inventoryId) {
        if (!inventoryId) throw new BadRequestError("Inventory ID is required");
        return tagRepository.findTagsByInventory(inventoryId);
    },

    async getAllTags() {
        return tagRepository.findAllTags();
    },

    async searchTags(prefix) {
        if (!prefix) throw new BadRequestError("Search prefix is required");
        return tagRepository.searchTagsByPrefix(prefix);
    },
};
