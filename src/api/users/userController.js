import { userService } from "./userService.js";

export const userController = {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    async changeRole(req, res, next) {
        const { userIds, roleId } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "No users selected" });
        }

        try {
            const result = await userService.updateUsersRoleBatch(userIds, roleId);
            res.json({
                message: `${result.count} users' roles updated`,
                count: result.count
            });
        } catch (error) {
            next(error);
        }
    },

    async setActive(req, res, next) {
        const { userIds, isActive } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "No users selected" });
        }

        try {
            const result = await userService.toggleUsersActive(userIds, isActive);
            res.json({
                message: `${result.count} users ${isActive ? "unblocked" : "blocked"} successfully`,
                count: result.count
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req, res, next) {
        const { userIds } = req.body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "No users selected" });
        }

        try {
            const result = await userService.deleteUsersBatch(userIds);
            res.json({ message: `${result.count} users deleted`, count: result.count });
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req, res, next) {
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "User ID is required" });

        try {
            const user = await userService.getUserById(id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

