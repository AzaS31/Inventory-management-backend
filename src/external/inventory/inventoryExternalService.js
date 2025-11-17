import { inventoryExternalRepository } from "./inventoryExternalRepository.js";

export const inventoryExternalService = {
    getTopValues(values) {
        const freq = {};
        for (const val of values) {
            freq[val] = (freq[val] || 0) + 1;
        }
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([value, count]) => ({ value, count }));
    },

    aggregateItemFields(items) {
        const aggregates = {};

        const numericFields = ['pages', 'year', 'likesCount'];
        for (const field of numericFields) {
            const nums = items.map(item => item[field]).filter(v => typeof v === 'number');
            const sum = nums.reduce((a, b) => a + b, 0);
            aggregates[field] = {
                type: 'NUMERIC',
                min: Math.min(...nums),
                max: Math.max(...nums),
                average: nums.length ? sum / nums.length : null,
            };
        }

        const textFields = ['author', 'name'];
        for (const field of textFields) {
            const values = items.map(item => item[field]).filter(v => !!v);
            aggregates[field] = {
                type: 'TEXT',
                topValues: this.getTopValues(values),
            };
        }

        return aggregates;
    },

    async getAggregatedInventory(token) {
        const inventory = await inventoryExternalRepository.getInventoryWithItemsByToken(token);
        if (!inventory) return null;

        const aggregates = this.aggregateItemFields(inventory.items);

        const fields = [
            ...['pages', 'year', 'likesCount'].map(f => ({ title: f, type: 'NUMERIC' })),
            ...['author', 'name'].map(f => ({ title: f, type: 'TEXT' })),
        ];

        return {
            title: inventory.title,
            fields,
            aggregates,
        };
    },
}