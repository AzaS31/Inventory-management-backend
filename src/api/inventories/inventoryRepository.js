import prisma from "../../config/database.js";

export const inventoryRepository = {
    async findLatest(limit = 10) {
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

    async findTopFive() {
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

    async findByOwner(userId) {
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

    async findAccessible(userId) {
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

    async findById(id) {
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

    async create(data) {
        return prisma.inventory.create({
            data,
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
            },
        });
    },

    async update(id, expectedVersion, dataToUpdate) {
        return prisma.inventory.update({
            where: {
                id,
                version: {
                    equals: expectedVersion
                },
            },
            data: {
                ...dataToUpdate, 
                version: { increment: 1 },
            },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
            },
        });
    },

    async deleteById(id) {
        return prisma.inventory.delete({ where: { id } });
    },

    async deleteBatch(ids) {
        return prisma.inventory.deleteMany({ where: { id: { in: ids } } });
    },

    async findAllSorted(sortBy, order) {
        const validOrder = order.toLowerCase() === "desc" ? "desc" : "asc";

        const orderObj = sortBy === "category"
            ? { category: { name: validOrder } }
            : { [sortBy]: validOrder };

        return prisma.inventory.findMany({
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true, comments: true } },
            },
            orderBy: orderObj,
        });
    },

    async findFilteredByCategory(userId, categoryId) {
        return prisma.inventory.findMany({
            where: {
                ownerId: userId,
                categoryId: categoryId || undefined,
            },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true, comments: true } },
            },
        });
    },
};
