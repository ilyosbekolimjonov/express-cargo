import dotenv from 'dotenv'
dotenv.config()

export const config = {
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
    },
    databaseUrl: process.env.DATABASE_URL,
}