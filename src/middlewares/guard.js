import { config } from "../config/index.js"
import { verifyToken } from "../helpers/jwt.js"
import { PrismaClient } from "@prisma/client"
import { ApiError } from "./apiError.js"

const prisma = new PrismaClient()

export const authGuard = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "Token mavjud emas"))
        }

        const token = authHeader.split(" ")[1]
        const verified = await verifyToken(token, config.jwt.accessSecret)

        const user = await prisma.user.findUnique({
            where: { id: verified.id },
            include: { roles: true },
        })

        if (!user) return next(new ApiError(404, "Foydalanuvchi topilmadi"))

        req.user = user
        next()
    } catch {
        next(new ApiError(401, "Token yaroqsiz yoki muddati tugagan"))
    }
}

export const refreshGuard = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "Refresh token mavjud emas"))
        }

        const token = authHeader.split(" ")[1]
        const decoded = await verifyToken(token, process.env.JWT_REFRESH_SECRET)
        req.user = decoded
        next()
    } catch {
        next(new ApiError(401, "Refresh token yaroqsiz yoki muddati tugagan"))
    }
}

export const roleGuard = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user.roles;
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
            success: false,
            message: "Bu amal uchun ruxsat yo'q",
        });
    }
    next();
};

export const selfGuard = (req, res, next) => {
    try {
        let { id } = req.params
        let { role } = req.user
        if (id == req.user.id || role == "admin") {
            next()
            return
        }
        res.status(405).send({ message: "Not allowed !" })
    } catch (error) {
        return next(error)
    }
}