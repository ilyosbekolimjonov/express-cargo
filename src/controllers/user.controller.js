import { UserService } from "../services/user.service.js"
import { updateUserSchema } from "../validations/user.validation.js"

export const UserController = {
    async getAllUsers(req, res, next) {
        try {
            const { page, limit } = req.query

            const result = await UserService.getUsers(page, limit)

            res.json({
                success: true,
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: result.data
            })
        } catch (error) {
            next(error)
        }
    },

    async getSingleUser(req, res, next) {
        try {
            const { id } = req.params
            const user = await UserService.getUserById(id)
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Foydalanuvchi topilmadi"
                })
            }
            const { password, refresh_token, ...safeUser } = user

            res.json({
                success: true,
                data: safeUser
            })
        } catch (error) {
            next(error)
        }
    },

    async updateUser(req, res, next) {
        try {
            const validated = updateUserSchema.parse(req.body)
            const { id } = req.params

            const updated = await UserService.updateUser(id, validated)

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Foydalanuvchi topilmadi"
                })
            }

            res.json({
                success: true,
                data: updated
            })
        } catch (error) {
            next(error)
        }
    },

    async removeUser(req, res, next) {
        try {
            const { id } = req.params

            const deleted = await UserService.deleteUser(id)

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Foydalanuvchi topilmadi"
                })
            }

            res.json({
                success: true,
                message: "Foydalanuvchi o'chirildi"
            })

        } catch (error) {
            next(error)
        }
    },
}