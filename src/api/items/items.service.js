import prisma from "../../config/database.js";

export const getItemsByInventory = async (inventoryId) => {
    return prisma.item.findMany({
        where: { inventoryId },
        include: {
            likes: true,
            customValues: {
                include: {
                    customField: { select: { name: true, type: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getItem = async (itemId) => {
    return prisma.item.findUnique({
        where: { id: itemId },
        include: {
            likes: {
                include: { user: { select: { username: true } } },
            },
            customValues: {
                include: {
                    customField: { select: { name: true, type: true } },
                },
            },
        },
    });
};

export const createItem = async (inventoryId, data) => {
    const { customId, name, description, status } = data;
    try {
        const item = await prisma.item.create({
            data: {
                inventoryId,
                customId,
                name,
                description,
                status: status || "available",
            },
        });

        await prisma.inventory.update({
            where: { id: inventoryId },
            data: { itemsCount: { increment: 1 } },
        });

        return item;
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
            data: { customId, name, description, status, updatedAt: new Date() },
        });
    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("Duplicate customId in this inventory");
        }
        throw err;
    }
};

export const deleteItem = async (itemId) => {
    const existing = await prisma.item.findUnique({
        where: { id: itemId },
        select: { inventoryId: true },
    });
    if (!existing) throw new Error("Item not found");

    await prisma.item.delete({ where: { id: itemId } });

    await prisma.inventory.update({
        where: { id: existing.inventoryId },
        data: { itemsCount: { decrement: 1 } },
    });

    return { message: "Item deleted successfully" };
};
