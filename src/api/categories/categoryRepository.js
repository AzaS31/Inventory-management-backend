import prisma from "../../config/database.js";

export const categoryRepository = {
    findAll() {
        return prisma.category.findMany({ orderBy: { createdAt: "desc" } });
    },

    findById(id) {
        return prisma.category.findUnique({ where: { id } });
    },
};
