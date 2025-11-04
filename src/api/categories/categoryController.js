import { categoryService } from "./categoryService.js";

export const categoryController = {
    async getAll(req, res, next) {
        try {
            const categories = await categoryService.getAll();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) return res.status(404).json({ error: "Category not found" });
            res.json(category);
        } catch (error) {
            next(error);
        }
    },
}


