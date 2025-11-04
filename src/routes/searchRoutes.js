import express from "express";
import { searchController } from "../api/search/searchController.js";
// import { requireAuthOptional } from "../middlewares/requireAuthOptional.js";

const router = express.Router();

router.get("/", searchController.search);

export default router;
