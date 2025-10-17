import prisma from "../../config/database.js";

// Получить все публичные инвентари
export const getAll = async () => {
    return prisma.inventory.findMany({
        where: { isPublic: true },
        include: {
            owner: { select: { username: true } },
            items: true,
            comments: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

// Получить конкретный инвентарь
export const getById = async (id) => {
    return prisma.inventory.findUnique({
        where: { id },
        include: {
            owner: { select: { username: true } },
            items: true,
            comments: {
                include: {
                    author: { select: { username: true } },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });
};

// Создать инвентарь
export const create = async (data) => {
    return prisma.inventory.create({ data });
};

// Обновить (только если владелец)
export const update = async (id, updates, userId) => {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new Error("Inventory not found");
    if (existing.ownerId !== userId) throw new Error("Not authorized");

    return prisma.inventory.update({
        where: { id },
        data: updates,
    });
};

// Удалить (только если владелец)
export const remove = async (id, userId) => {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new Error("Inventory not found");
    if (existing.ownerId !== userId) throw new Error("Not authorized");

    return prisma.inventory.delete({ where: { id } });
};
