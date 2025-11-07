import { inventoryAccessService } from "./inventoryAccessService.js";

export const inventoryAccessController = {
  async addAccess(req, res, next) {
    try {
      const { inventoryId, identifier } = req.body;
      const access = await inventoryAccessService.grantAccess(inventoryId, identifier);
      res.json(access);
    } catch (error) {
      next(error);
    }
  },

  async removeAccess(req, res, next) {
    try {
      const { inventoryId, userId } = req.params;
      await inventoryAccessService.revokeAccess(inventoryId, userId);
      res.json({ message: "Access revoked" });
    } catch (error) {
      next(error);
    }
  },

  async getAccessList(req, res, next) {
    try {
      const { inventoryId } = req.params;
      const accessList = await inventoryAccessService.getAccessList(inventoryId);
      res.json(accessList);
    } catch (error) {
      next(error);
    }
  },

  async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      const users = await inventoryAccessService.searchUsers(q);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
}
