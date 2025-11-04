import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/database.js";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
    NotFoundError,
} from "../../utils/errors.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authService = {
    async registerUser({ username, email, password }) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new ConflictError("Email already in use");

        if (!password) throw new BadRequestError("Password is required");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

        return {
            token,
            user: { id: newUser.id, username, email },
        };
    },

    async loginUser({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundError("User not found");

        if (!user.password)
            throw new BadRequestError("This account uses social login only");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedError("Invalid password");

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return {
            token,
            user: { id: user.id, username: user.username, email: user.email },
        };
    },

    async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: { select: { name: true } },
            },
        });

        if (!user) throw new NotFoundError("User profile not found");

        return user;
    },
};
