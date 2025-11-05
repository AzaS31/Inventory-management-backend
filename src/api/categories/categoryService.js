import { categoryRepository } from "./categoryRepository.js";
import { NotFoundError } from "../../utils/errors.js";

export const categoryService = {
    async getAll() {
        return categoryRepository.findAll();
    },

    async getById(id) {
        const category = await categoryRepository.findById(id);
        if (!category) throw new NotFoundError(`Category with ID ${id} not found.`);
        return category;
    },
};
