import prisma from "../../config/database.js";

export const customFieldRepository = {
    async create({ inventoryId, name, description, type, showInTable = true, order }) {
        return prisma.customField.create({
            data: { inventoryId, name, description, type, showInTable, order },
        });
    },

    async findAllByInventory(inventoryId) {
        return prisma.customField.findMany({
            where: { inventoryId },
            orderBy: { order: "asc" },
        });
    },

    async updateById(fieldId, data) {
        return prisma.customField.update({
            where: { id: fieldId },
            data,
        });
    },

    async deleteById(fieldId) {
        return prisma.customField.delete({
            where: { id: fieldId },
        });
    },
};
