import { searchRepository } from "./searchRepository.js";
import { BadRequestError } from "../../utils/errors.js";

export const searchService = {
    async search(query, user) {
        if (!query || query.trim() === "") {
            throw new BadRequestError("Search query cannot be empty");
        }

        const isGuest = !user;

        const [inventories, items] = await Promise.all([
            searchRepository.findInventories(query, isGuest),
            searchRepository.findItems(query, isGuest),
        ]);

        return { inventories, items };
    },
};
