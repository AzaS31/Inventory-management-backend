import prisma from "../../config/database.js";
import { NotFoundError, ConflictError, BadRequestError } from "../../utils/errors.js";

export const inventoryAccessService = {
  async getAccessList(inventoryId) {
    if (!inventoryId) {
      throw new BadRequestError("Inventory ID is required.");
    }

    const accesses = await prisma.inventoryAccess.findMany({
      where: { inventoryId },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    });

    return accesses;
  },

  async grantAccessByEmail(inventoryId, email) {
    if (!email) {
      throw new BadRequestError("Email is required to grant access.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    try {
      const access = await prisma.inventoryAccess.upsert({
        where: { inventoryId_userId: { inventoryId, userId: user.id } },
        update: {},
        create: { inventoryId, userId: user.id },
        include: {
          user: { select: { id: true, username: true, email: true } },
        },
      });

      return access;
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError("This user already has access to the inventory.");
      }
      throw error;
    }
  },

  async revokeAccess(inventoryId, userId) {
    try {
      await prisma.inventoryAccess.delete({
        where: { inventoryId_userId: { inventoryId, userId } },
      });

      return { message: "Access revoked successfully." };
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError("Access not found or already revoked.");
      }
      throw error;
    }
  },
};
