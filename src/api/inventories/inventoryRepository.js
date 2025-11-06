import prisma from "../../config/database.js";

export const inventoryRepository = {
    findLatest(limit = 10) {
        return prisma.inventory.findMany({
            where: { isPublic: true },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    findTopFive() {
        return prisma.inventory.findMany({
            where: { isPublic: true },
            take: 5,
            orderBy: { items: { _count: "desc" } },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true } },
            },
        });
    },

    findByOwner(userId) {
        return prisma.inventory.findMany({
            where: { ownerId: userId },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    findAccessible(userId) {
        return prisma.inventory.findMany({
            where: {
                OR: [
                    { accesses: { some: { userId } }, ownerId: { not: userId } },
                    { isPublic: true, ownerId: { not: userId } },
                ],
            },
            include: {
                owner: { select: { id: true, username: true } },
                category: { select: { id: true, name: true } },
                _count: { select: { items: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    findById(id) {
        return prisma.inventory.findUnique({
            where: { id },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                items: {
                    include: {
                        customValues: { include: { customField: { select: { name: true, type: true } } } },
                        likes: true,
                    },
                },
                comments: { include: { author: { select: { username: true } } }, orderBy: { createdAt: "desc" } },
                customFields: true,
                accesses: { select: { user: { select: { id: true, username: true, email: true } } } },
            },
        });
    },

    create(data) {
        return prisma.inventory.create({
            data,
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
            },
        });
    },

    update(id, expectedVersion, data) {
        return prisma.inventory.update({
            where: {
                id,
                version: expectedVersion, 
            },
            data: {
                ...data,
                version: { increment: 1 }, 
            },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
            },
        });
    },

    deleteById(id) {
        return prisma.inventory.delete({ where: { id } });
    },

    deleteBatch(ids) {
        return prisma.inventory.deleteMany({ where: { id: { in: ids } } });
    },
};
