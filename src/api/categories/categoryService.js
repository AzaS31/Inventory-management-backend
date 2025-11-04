import prisma from "../../config/database.js";
import { NotFoundError } from "../../utils/errors.js";

export const categoryService = {
    async getAll() {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        });
        return categories;
    },

    async getById(id) {
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundError(`Category with ID ${id} not found.`);
        }
        return category;
    },
};