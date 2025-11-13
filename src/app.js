import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import prisma from './config/database.js';
import passport from 'passport';
import "./config/passport.js";
import session from "express-session";
import inventoryRoutes from './routes/inventoryRoutes.js'; 
import itemsRoutes from "./routes/itemsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import inventoryAccessRoutes from "./routes/inventoryAccessRoutes.js";
import customFieldRoutes from "./routes/customFieldRoutes.js";
import itemLikeRoutes from "./routes/itemLikeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import salesforceRoutes from "./routes/salesforceRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";


config();
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'not connected', error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/items", itemsRoutes); 
app.use("/api/categories", categoryRoutes);
app.use("/api/inventory-access", inventoryAccessRoutes);
app.use("/api/custom-fields", customFieldRoutes);
app.use("/api/item-likes", itemLikeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/salesforce", salesforceRoutes);

app.use(errorHandler);

export default app;
