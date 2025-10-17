import * as userService from "./users.service.js";

export async function getUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to load users", error: err.message });
    }
}

export async function changeRole(req, res) {
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
    } catch (err) {
        res.status(500).json({ message: "Failed to update roles", error: err.message });
    }
}

export async function setActive(req, res) {
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
    } catch (err) {
        res.status(500).json({ message: "Failed to update users", error: err.message });
    }
}

export async function removeUser(req, res) {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "No users selected" });
    }

    try {
        const result = await userService.deleteUsersBatch(userIds);
        res.json({ message: `${result.count} users deleted`, count: result.count });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete users", error: err.message });
    }
}
