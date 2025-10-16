import prisma from "../../config/database.js";

export async function getAllUsers() {
    return prisma.user.findMany({
        select: { id: true, username: true, email: true, isActive: true, roleId: true },
    });
}

export async function updateUserRole(userId, roleId) {
    return prisma.user.update({
        where: { id: userId },
        data: { roleId },
    });
}

export async function toggleUserActive(userId, isActive) {
    return prisma.user.update({
        where: { id: userId },
        data: { isActive },
    });
}

export async function deleteUser(userId) {
    return prisma.user.delete({ where: { id: userId } });
}
