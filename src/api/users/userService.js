import prisma from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../utils/errors.js";

export const userService = {
    async getAllUsers() {
        try {
            return await prisma.user.findMany({
                select: { id: true, username: true, email: true, isActive: true, roleId: true },
            });
        } catch (err) {
            throw new BadRequestError("Failed to fetch users");
        }
    },

    async updateUsersRoleBatch(userIds, roleId) {
        try {
            if (!userIds?.length) throw new BadRequestError("User IDs are required");
            if (!roleId) throw new BadRequestError("Role ID is required");

            const result = await prisma.user.updateMany({
                where: { id: { in: userIds } },
                data: { roleId },
            });

            if (result.count === 0) throw new NotFoundError("No users found for update");
            return result;
        } catch (err) {
            throw err.isOperational ? err : new BadRequestError("Failed to update user roles");
        }
    },

    async toggleUsersActive(userIds, isActive) {
        try {
            if (!userIds?.length) throw new BadRequestError("User IDs are required");
            if (typeof isActive !== "boolean") throw new BadRequestError("Invalid isActive value");

            const result = await prisma.user.updateMany({
                where: { id: { in: userIds } },
                data: { isActive },
            });

            if (result.count === 0) throw new NotFoundError("No users found to update");
            return result;
        } catch (err) {
            throw err.isOperational ? err : new BadRequestError("Failed to toggle user active status");
        }
    },

    async deleteUsersBatch(userIds) {
        try {
            if (!userIds?.length) throw new BadRequestError("User IDs are required");

            const result = await prisma.user.deleteMany({
                where: { id: { in: userIds } },
            });

            if (result.count === 0) throw new NotFoundError("No users found to delete");
            return result;
        } catch (err) {
            throw err.isOperational ? err : new BadRequestError("Failed to delete users");
        }
    },

    async getUserById(id) {
        try {
            if (!id) throw new BadRequestError("User ID is required");

            const user = await prisma.user.findUnique({
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

            if (!user) throw new NotFoundError(`User with ID ${id} not found`);
            return user;
        } catch (err) {
            throw err.isOperational ? err : new BadRequestError("Failed to fetch user");
        }
    },
};
