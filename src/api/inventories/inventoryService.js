import prisma from "../../config/database.js";
import { BadRequestError, NotFoundError, UnauthorizedError, ConflictError } from "../../utils/errors.js";

export const inventoryService = {
    async getAll() {
        return prisma.inventory.findMany({
            where: { isPublic: true },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async getTopFive() {
        return prisma.inventory.findMany({
            where: { isPublic: true },
            take: 5,
            orderBy: {
                items: { _count: "desc" },
            },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
                _count: { select: { items: true } },
            },
        });
    },

    async getInventoriesById(userId) {
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

    async getAccessibleInventoriesById(userId) {
        return prisma.inventory.findMany({
            where: {
                OR: [
                    {
                        accesses: { some: { userId } },
                        ownerId: { not: userId },
                    },
                    {
                        isPublic: true,
                        ownerId: { not: userId },
                    },
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

    async getInventoryById(id) {
        const inventory = await prisma.inventory.findUnique({
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
                    include: { author: { select: { username: true } } },
                    orderBy: { createdAt: "desc" },
                },
                customFields: true,
                accesses: {
                    select: { user: { select: { id: true, username: true, email: true } } },
                },
            },
        });

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        return inventory;
    },

    async create(data) {
        const { title, description, isPublic, ownerId, categoryId, customIdFormat } = data;

        if (!title || !ownerId) {
            throw new BadRequestError("Title and ownerId are required.");
        }

        try {
            return await prisma.inventory.create({
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
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictError("Inventory with the same title already exists.");
            }
            throw error;
        }
    },

    async update(id, updates, userId) {
        const existing = await prisma.inventory.findUnique({
            where: { id },
            include: {
                accesses: { where: { userId } },
            },
        });

        if (!existing) throw new NotFoundError("Inventory not found");

        const isOwner = existing.ownerId === userId;
        const hasEditAccess = existing.accesses.length > 0;

        if (!isOwner && !hasEditAccess) {
            throw new UnauthorizedError("You are not authorized to edit this inventory.");
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
    },

    async delete(id, userId) {
        const existing = await prisma.inventory.findUnique({ where: { id } });

        if (!existing) throw new NotFoundError("Inventory not found");
        if (existing.ownerId !== userId) {
            throw new UnauthorizedError("You are not authorized to delete this inventory.");
        }

        return prisma.inventory.delete({ where: { id } });
    },

    async deleteBatch(inventoryIds, userId) {
        try {
            const inventories = await prisma.inventory.findMany({
                where: { id: { in: inventoryIds } },
                select: { id: true, ownerId: true },
            });

            const unauthorized = inventories.some(inv => inv.ownerId !== userId);
            if (unauthorized) {
                throw new UnauthorizedError("You are not authorized to delete some of these inventories.");
            }

            const result = await prisma.inventory.deleteMany({
                where: { id: { in: inventoryIds } },
            });

            if (result.count === 0) {
                throw new NotFoundError("No inventories were deleted.");
            }

            return { message: `Deleted ${result.count} inventories successfully.` };
        } catch (error) {
            throw error.isOperational ? err : new BadRequestError("Failed to delete inventories.");
        }
    },

    async updateCustomIdFormat(id, customIdFormat, userId) {
        const existing = await prisma.inventory.findUnique({
            where: { id },
            include: { accesses: { where: { userId } } },
        });

        if (!existing) throw new NotFoundError("Inventory not found");

        const isOwner = existing.ownerId === userId;
        const hasEditAccess = existing.accesses.length > 0;

        if (!isOwner && !hasEditAccess) {
            throw new UnauthorizedError("You are not authorized to update custom ID format.");
        }

        return prisma.inventory.update({
            where: { id },
            data: {
                customIdFormat,
                updatedAt: new Date(),
            },
            include: {
                owner: { select: { username: true } },
                category: { select: { name: true } },
            },
        });
    },
};
