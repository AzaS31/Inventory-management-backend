import prisma from "../../config/database.js";

export const grantAccess = async (inventoryId, userId) => {
  return prisma.inventoryAccess.upsert({
    where: { inventoryId_userId: { inventoryId, userId } },
    update: {},
    create: { inventoryId, userId },
  });
};

export const revokeAccess = async (inventoryId, userId) => {
  return prisma.inventoryAccess.delete({
    where: { inventoryId_userId: { inventoryId, userId } },
  });
};

export const getAccessList = async (inventoryId) => {
  return prisma.inventoryAccess.findMany({
    where: { inventoryId },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  });
};
