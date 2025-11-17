import { inventoryExternalService } from "./inventoryExternalService.js";

export const inventoryExternalController = {
    async getAggregatedInventoryByToken(req, res, next) {
        try {
            const { token } = req.params;
            const result = await inventoryExternalService.getAggregatedInventory(token);

            if (!result) {
                return res.status(404).json({ error: 'Inventory not found' });
            }

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
} 