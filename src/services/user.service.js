import db from "../db/knex.js"
import { paginate } from "../utils/pagination.js"

export const UserService = {
    async getUsers(page, limit) {
        const { page: currentPage, limit: take, offset } = paginate(page, limit)

        const [{ count }] = await db("users").count("* as count")

        const users = await db("users")
            .select("id", "full_name", "email", "phone_number","role", "created_at", "updated_at")
            .limit(take)
            .offset(offset)

        return {
            page: currentPage,
            limit: take,
            total: Number(count),
            data: users
        }
    },

    getUserById(id) {
        return db("users").where({ id }).first()
    },

    async updateUser(id, data) {
        const updated = await db("users")
            .where({ id })
            .update(
                {
                    ...data,
                    updated_at: db.fn.now()
                }
            )
            .returning("*")

        if (!updated || updated.length === 0) return null

        const user = updated[0]
        const { password, refresh_token, ...safeUser } = user
        return safeUser
    },

    async deleteUser(id) {
        return await db("users")
            .where({ id })
            .del()
    },
}