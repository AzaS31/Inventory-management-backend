import prisma from "../../config/database.js";

export const customFieldService = {
  async create(inventoryId, data) {
    return await prisma.customField.create({
      data: {
        inventoryId,
        name: data.name,
        description: data.description,
        type: data.type,
        showInTable: data.showInTable ?? true,
        order: data.order,
      },
    });
  },

  async getAll(inventoryId) {
    return await prisma.customField.findMany({
      where: { inventoryId },
      orderBy: { order: "asc" },
    });
  },

  async update(fieldId, data) {
    return await prisma.customField.update({
      where: { id: fieldId },
      data,
    });
  },

  async delete(fieldId) {
    return await prisma.customField.delete({
      where: { id: fieldId },
    });
  },
};
