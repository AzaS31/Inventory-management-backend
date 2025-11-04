import { searchService } from "./searchService.js";

export const searchController = {
    async search(req, res) {
        try {
            const query = req.query.q?.trim();
            const user = req.user; 

            if (!query || query.length < 2) {
                return res.status(400).json({ error: "Query must be at least 2 characters long" });
            }

            const results = await searchService.search(query, user);
            res.json(results);
        } catch (error) {
            console.error("Search error:", error);
            res.status(500).json({ error: "Search failed" });
        }
    },
};
