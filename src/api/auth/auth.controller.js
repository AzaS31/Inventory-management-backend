import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: newUser.id, username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user.id, username: user.username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: { select: { name: true } } 
            },
        });

        res.json(user);
    } catch {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
