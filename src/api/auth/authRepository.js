import prisma from "../../config/database.js";

export const authRepository = {
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },

    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                role: { select: { name: true } },
            },
        });
    },

    async createUser({ username, email, password }) {
        return prisma.user.create({
            data: { username, email, password },
        });
    },
};
