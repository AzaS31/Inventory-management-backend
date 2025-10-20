import prisma from "../../config/database.js";

export const getAll = async () => {
    return prisma.inventory.findMany({
        where: { isPublic: true },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
            _count: { select: { items: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getById = async (id) => {
    return prisma.inventory.findUnique({
        where: { id },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
            items: {
                include: {
                    customValues: {
                        include: { customField: { select: { name: true, type: true } } },
                    },
                    likes: true,
                },
            },
            comments: {
                include: {
                    author: { select: { username: true } },
                },
                orderBy: { createdAt: "desc" },
            },
            customFields: true,
        },
    });
};

export const create = async (data) => {
    const { title, description, isPublic, ownerId, categoryId } = data;

    return prisma.inventory.create({
        data: {
            title,
            description,
            isPublic,
            ownerId,
            categoryId: categoryId || null,
        },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
        },
    });
};

export const update = async (id, updates, userId) => {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new Error("Inventory not found");
    if (existing.ownerId !== userId) throw new Error("Not authorized");

    const { title, description, isPublic, categoryId } = updates;

    return prisma.inventory.update({
        where: { id },
        data: {
            title,
            description,
            isPublic,
            categoryId,
            updatedAt: new Date(),
        },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
        },
    });
};

export const remove = async (id, userId) => {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new Error("Inventory not found");
    if (existing.ownerId !== userId) throw new Error("Not authorized");

    return prisma.inventory.delete({ where: { id } });
};
