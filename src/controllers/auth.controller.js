import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import {
    verifyToken,
    generateAccessToken,
    generateRefreshToken,
} from "../helpers/jwt.js";
import { ApiError } from "../middlewares/apiError.js";

export const authController = {
    // 🧩 Ro‘yxatdan o‘tish
    async signup(req, res, next) {
        try {
            const { full_name, phone_number, email, password, roles } = req.body;

            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return next(new ApiError(403, "Email oldin ro'yxatdan o'tgan"));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Yangi user yaratish
            const newUser = await prisma.user.create({
                data: {
                    full_name,
                    phone_number,
                    email: email.toLowerCase(),
                    password_hash: hashedPassword,
                    roles: roles || "CUSTOMER",
                },
                include: { roles: true },
            });

            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            res.status(201).json({
                success: true,
                message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
                data: {
                    user: {
                        id: newUser.id,
                        full_name: newUser.full_name,
                        email: newUser.email,
                        roles: newUser.roles.map((r) => r.name),
                    },
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 🔐 Tizimga kirish
    async signin(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                include: { roles: true },
            });

            if (!user) return next(new ApiError(404, "User topilmadi"));

            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return next(new ApiError(401, "Email yoki parol noto'g'ri"));
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.status(200).json({
                success: true,
                message: "Kirish muvaffaqiyatli amalga oshirildi",
                data: {
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        roles: user.roles.map((r) => r.name),
                    },
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 👤 Profilni olish
    async profile(req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                include: { roles: true },
            });

            if (!user) return next(new ApiError(404, "User topilmadi"));

            const {  ...safeUser } = user; // password_hash ni olib tashlash

            res.status(200).json({
                success: true,
                message: "Foydalanuvchi profili",
                data: {
                    ...safeUser,
                    roles: user.roles.map((r) => r.name),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 🔄 Refresh token orqali yangilash
    async updateAccess(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next(new ApiError(401, "Refresh token yo'q"));
            }

            const refreshToken = authHeader.split(" ")[1];
            const decoded = await verifyToken(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: { roles: true },
            });

            if (!user) return next(new ApiError(404, "User topilmadi"));

            const accessToken = generateAccessToken(user);

            res.status(200).json({
                success: true,
                message: "Access token yangilandi",
                data: { accessToken },
            });
        } catch {
            next(new ApiError(401, "Yaroqsiz yoki muddati tugagan refresh token"));
        }
    },
};
