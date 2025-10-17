import prisma from "../../config/database.js";

export const getItemsByInventory = async (inventoryId) => {
    return prisma.item.findMany({
        where: { inventoryId },
    });
};

export const getItem = async (itemId) => {
    return prisma.item.findUnique({
        where: { id: itemId },
    });
};

export const createItem = async (inventoryId, data) => {
    const { customId, name, description, status } = data;
    try {
        return await prisma.item.create({
            data: {
                inventoryId,
                customId,
                name,
                description,
                status: status || "available",
            },
        });
    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("Duplicate customId in this inventory");
        }
        throw err;
    }
};

export const updateItem = async (itemId, data) => {
    const { customId, name, description, status } = data;
    try {
        return await prisma.item.update({
            where: { id: itemId },
            data: { customId, name, description, status },
        });
    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("Duplicate customId in this inventory");
        }
        throw err;
    }
};

export const deleteItem = async (itemId) => {
    return prisma.item.delete({ where: { id: itemId } });
};
