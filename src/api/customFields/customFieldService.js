import { customFieldRepository } from "./customFieldRepository.js";
import { BadRequestError, NotFoundError, ConflictError } from "../../utils/errors.js";

export const customFieldService = {
  async create(inventoryId, data) {
    if (!data.name || !data.type) {
      throw new BadRequestError("Custom field must have a name and type.");
    }

    try {
      return await customFieldRepository.create({
        inventoryId,
        name: data.name,
        description: data.description,
        type: data.type,
        showInTable: data.showInTable,
        order: data.order,
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError(`Custom field with name "${data.name}" already exists.`);
      }
      throw error;
    }
  },

  async getAll(inventoryId) {
    return customFieldRepository.findAllByInventory(inventoryId);
  },

  async update(fieldId, data) {
    try {
      return await customFieldRepository.updateById(fieldId, data);
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
      await customFieldRepository.deleteById(fieldId);
      return { message: "Custom field deleted successfully." };
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError(`Custom field with ID ${fieldId} not found.`);
      }
      throw error;
    }
  },
};
