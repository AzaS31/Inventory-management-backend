import prisma from "../../config/database.js";

export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const getCategoryById = async (id) => {
    return prisma.category.findUnique({ where: { id } });
};

export const createCategory = async (data) => {
    const { name, description } = data;
    return prisma.category.create({ data: { name, description } });
};

export const updateCategory = async (id, data) => {
    return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id) => {
    return prisma.category.delete({ where: { id } });
};
