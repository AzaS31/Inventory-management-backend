import prisma from "../../config/database.js";

export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const getCategoryById = async (id) => {
    return prisma.category.findUnique({ where: { id } });
};


