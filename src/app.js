import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import prisma from './config/database.js';
import passport from 'passport';
import "./config/passport.js";
import session from "express-session";

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
app.use("/api/users", usersRoutes);

export default app;
