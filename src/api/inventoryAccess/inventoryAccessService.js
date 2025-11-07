import { inventoryAccessRepository } from "./inventoryAccessRepository.js";
import { BadRequestError, NotFoundError, ConflictError } from "../../utils/errors.js";

export const inventoryAccessService = {
  async getAccessList(inventoryId) {
    if (!inventoryId) throw new BadRequestError("Inventory ID is required.");
    return inventoryAccessRepository.findByInventoryId(inventoryId);
  },

  async grantAccess(inventoryId, identifier) {
    if (!identifier) throw new BadRequestError("Email or username is required.");

    const user = await inventoryAccessRepository.findUserByEmailOrUsername(identifier);
    if (!user) throw new NotFoundError("User not found.");

    try {
      return inventoryAccessRepository.upsertAccess(inventoryId, user.id);
    } catch (error) {
      if (error.code === "P2002")
        throw new ConflictError("This user already has access to the inventory.");
      throw error;
    }
  },

  async revokeAccess(inventoryId, userId) {
    try {
      await inventoryAccessRepository.deleteAccess(inventoryId, userId);
      return { message: "Access revoked successfully." };
    } catch (error) {
      if (error.code === "P2025") throw new NotFoundError("Access not found or already revoked.");
      throw error;
    }
  },

  async searchUsers(query) {
    if (!query || query.length < 2)
      return [];
    return inventoryAccessRepository.searchUsersByQuery(query);
  },
};
