import prisma from "../prismaClient.js"
import bcrypt from "bcrypt"
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js"

export const userController = {
    async create(req, res, next) {
        try {
            const { error } = createUserSchema.validate(req.body)
            if (error) return next({ status: 400, message: error.message })

            const { full_name, email, password, phone_number } = req.body

            const existing = await prisma.user.findUnique({ where: { email } })
            if (existing) return next({ status: 400, message: "Bu email allaqachon mavjud." })

            const hash = await bcrypt.hash(password, 10)

            const user = await prisma.user.create({
                data: { full_name, email, password_hash: hash, phone_number },
            })

            res.status(201).json({ success: true, user })
        } catch (err) {
            next(err)
        }
    },

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, search = "" } = req.query
            const skip = (page - 1) * limit

            const where = search
                ? { full_name: { contains: search, mode: "insensitive" } }
                : {}

            const users = await prisma.user.findMany({
                where,
                skip: Number(skip),
                take: Number(limit),
            })

            const total = await prisma.user.count({ where })

            res.json({
                success: true,
                page: Number(page),
                totalPages: Math.ceil(total / limit),
                total,
                data: users,
            })
        } catch (err) {
            next(err)
        }
    },

    async getById(req, res, next) {
        try {
            const { id } = req.params
            const user = await prisma.user.findUnique({ where: { id: Number(id) } })
            if (!user) return next({ status: 404, message: "Foydalanuvchi topilmadi" })

            res.json({ success: true, user })
        } catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { error } = updateUserSchema.validate(req.body)
            if (error) return next({ status: 400, message: error.message })

            const data = { ...req.body }

            if (data.password) {
                data.password_hash = await bcrypt.hash(data.password, 10)
                delete data.password
            }

            const updated = await prisma.user.update({
                where: { id: Number(id) },
                data,
            })

            res.json({ success: true, updated })
        } catch (err) {
            next(err)
        }
    },

    async remove(req, res, next) {
        try {
            const { id } = req.params
            await prisma.user.delete({ where: { id: Number(id) } })
            res.json({ success: true, message: "Foydalanuvchi o'chirildi" })
        } catch (err) {
            next(err)
        }
    },
}