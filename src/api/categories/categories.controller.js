import * as categoryService from "./categories.service.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
