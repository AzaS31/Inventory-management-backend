import { inventoryAccessService } from "./inventoryAccessService.js";

export const inventoryAccessController = {
  async addAccess(req, res, next) {
    try {
      const { inventoryId, email } = req.body
      const access = await inventoryAccessService.grantAccessByEmail(inventoryId, email);
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
  }
}
