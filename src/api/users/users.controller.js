import * as userService from "./users.service.js";

export async function getUsers(req, res) {
    const users = await userService.getAllUsers();
    res.json(users);
}

export async function changeRole(req, res) {
    const { userIds, roleId } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "No users selected" });
    }

    const updatedUsers = [];

    for (const id of userIds) {
        const user = await userService.updateUserRole(id, roleId);
        updatedUsers.push(user);
    }

    res.json({ message: "Roles updated", updatedUsers });
}

export async function setActive(req, res) {
    const { userId, isActive } = req.body;
    const user = await userService.toggleUserActive(userId, isActive);
    res.json(user);
}

export async function removeUser(req, res) {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.json({ message: "User deleted" });
}
