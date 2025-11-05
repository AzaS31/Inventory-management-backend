import prisma from "../../config/database.js";

export const customFieldRepository = {
    create({ inventoryId, name, description, type, showInTable = true, order }) {
        return prisma.customField.create({
            data: { inventoryId, name, description, type, showInTable, order },
        });
    },

    findAllByInventory(inventoryId) {
        return prisma.customField.findMany({
            where: { inventoryId },
            orderBy: { order: "asc" },
        });
    },

    updateById(fieldId, data) {
        return prisma.customField.update({
            where: { id: fieldId },
            data,
        });
    },

    deleteById(fieldId) {
        return prisma.customField.delete({
            where: { id: fieldId },
        });
    },
};
