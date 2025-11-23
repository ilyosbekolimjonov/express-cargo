import dotenv from "dotenv"
dotenv.config()
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export default {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./src/db/migrations",
        },
        seeds: {
            directory: "./src/db/seeds",
        },
    },
}
