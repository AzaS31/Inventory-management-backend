import prisma from "../../config/database.js";

export const categoryRepository = {
    async findAll() {
        return prisma.category.findMany({ orderBy: { createdAt: "desc" } });
    },

    async findById(id) {
        return prisma.category.findUnique({ where: { id } });
    },
};
