import prisma from "../../config/database.js";
import { BadRequestError, NotFoundError, ConflictError } from "../../utils/errors.js";

export const customFieldService = {
  async create(inventoryId, data) {
    if (!data.name || !data.type) {
      throw new BadRequestError("Custom field must have a name and type.");
    }

    try {
      const newField = await prisma.customField.create({
        data: {
          inventoryId,
          name: data.name,
          description: data.description,
          type: data.type,
          showInTable: data.showInTable ?? true,
          order: data.order,
        },
      });

      return newField;
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError(`Custom field with name "${data.name}" already exists.`);
      }
      throw error;
    }
  },

  async getAll(inventoryId) {
    const fields = await prisma.customField.findMany({
      where: { inventoryId },
      orderBy: { order: "asc" },
    });

    return fields;
  },

  async update(fieldId, data) {
    try {
      const updated = await prisma.customField.update({
        where: { id: fieldId },
        data,
      });

      return updated;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError(`Custom field with ID ${fieldId} not found.`);
      }
      if (error.code === "P2002") {
        throw new ConflictError(`Custom field with name "${data.name}" already exists.`);
      }
      throw error;
    }
  },

  async delete(fieldId) {
    try {
      await prisma.customField.delete({
        where: { id: fieldId },
      });
      return { message: "Custom field deleted successfully." };
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError(`Custom field with ID ${fieldId} not found.`);
      }
      throw error;
    }
  },
};
