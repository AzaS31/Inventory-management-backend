import prisma from "../../config/database.js";

export const userRepository = {
    findAll() {
        return prisma.user.findMany({
            select: { id: true, username: true, email: true, isActive: true, roleId: true },
        });
    },

    updateRoleBatch(userIds, roleId) {
        return prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { roleId },
        });
    },

    toggleActiveStatus(userIds, isActive) {
        return prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { isActive },
        });
    },

    deleteBatch(userIds) {
        return prisma.user.deleteMany({
            where: { id: { in: userIds } },
        });
    },

    findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                isActive: true,
                roleId: true,
                role: { select: { name: true } },
                inventories: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        isPublic: true,
                        categoryId: true,
                        _count: { select: { items: true } },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    },
};
