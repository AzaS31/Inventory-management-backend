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

export const getMy = async (userId) => {
    return prisma.inventory.findMany({
        where: { ownerId: userId },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
            _count: { select: { items: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getAccessible = async (userId) => {
    return prisma.inventory.findMany({
        where: {
            OR: [
                {
                    accesses: {
                        some: { userId }
                    },
                    ownerId: { not: userId }
                },
                {
                    isPublic: true,
                    ownerId: { not: userId }
                }
            ]
        },
        include: {
            owner: { select: { id: true, username: true } },
            category: { select: { id: true, name: true } },
            _count: { select: { items: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getUserInventories = async (userId) => {
    return prisma.inventory.findMany({
        where: { ownerId: userId },
        include: {
            owner: { select: { id: true, username: true } },
            category: { select: { id: true, name: true } },
            _count: { select: { items: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getUserSharedInventories = async (userId) => {
    return prisma.inventory.findMany({
        where: {
            accesses: { some: { userId } },
            ownerId: { not: userId }
        },
        include: {
            owner: { select: { id: true, username: true } },
            category: { select: { id: true, name: true } },
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
    const { title, description, isPublic, ownerId, categoryId, customIdFormat } = data;

    return prisma.inventory.create({
        data: {
            title,
            description,
            isPublic,
            ownerId,
            categoryId: categoryId || null,
            customIdFormat,
        },
        include: {
            owner: { select: { username: true } },
            category: { select: { name: true } },
        },
    });
};

export const update = async (id, updates, userId) => {
    const existing = await prisma.inventory.findUnique({
        where: { id },
        include: {
            accesses: {
                where: { userId, canEdit: true },
            },
        },
    });

    if (!existing) throw new Error("Inventory not found");

    const isOwner = existing.ownerId === userId;
    const hasEditAccess = existing.accesses.length > 0;

    if (!isOwner && !hasEditAccess) {
        throw new Error("Not authorized");
    }

    const { title, description, isPublic, categoryId } = updates;

    const data = {
        title,
        description,
        isPublic,
        updatedAt: new Date(),
    };

    if (categoryId) data.categoryId = categoryId;

    return prisma.inventory.update({
        where: { id },
        data,
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
