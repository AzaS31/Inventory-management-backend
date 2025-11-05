import { userRepository } from "./userRepository.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

export const userService = {
    async getAllUsers() {
        try {
            return await userRepository.findAll();
        } catch (err) {
            throw new BadRequestError("Failed to fetch users");
        }
    },

    async updateUsersRoleBatch(userIds, roleId) {
        if (!userIds?.length) throw new BadRequestError("User IDs are required");
        if (!roleId) throw new BadRequestError("Role ID is required");

        const result = await userRepository.updateRoleBatch(userIds, roleId);
        if (result.count === 0) throw new NotFoundError("No users found for update");
        return result;
    },

    async toggleUsersActive(userIds, isActive) {
        if (!userIds?.length) throw new BadRequestError("User IDs are required");
        if (typeof isActive !== "boolean") throw new BadRequestError("Invalid isActive value");

        const result = await userRepository.toggleActiveStatus(userIds, isActive);
        if (result.count === 0) throw new NotFoundError("No users found to update");
        return result;
    },

    async deleteUsersBatch(userIds) {
        if (!userIds?.length) throw new BadRequestError("User IDs are required");

        const result = await userRepository.deleteBatch(userIds);
        if (result.count === 0) throw new NotFoundError("No users found to delete");
        return result;
    },

    async getUserById(id) {
        if (!id) throw new BadRequestError("User ID is required");

        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);
        return user;
    },
};

