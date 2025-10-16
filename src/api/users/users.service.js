import prisma from "../../config/database.js";

export async function getAllUsers() {
    return prisma.user.findMany({
        select: { id: true, username: true, email: true, isActive: true, roleId: true },
    });
}

export async function updateUsersRoleBatch(userIds, roleId) {
    const result = await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { roleId },
    });
    return result;
}

export async function toggleUsersActive(userIds, isActive) {
    const result = await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { isActive },
    });
    return result;
}

export async function deleteUsersBatch(userIds) {
    const result = await prisma.user.deleteMany({
        where: { id: { in: userIds } },
    });
    return result;
}