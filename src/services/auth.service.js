import bcrypt from "bcrypt"
import db from "../db/knex.js"
import { generateOtp, saveOtp, sendOtpToEmail } from "./otp.service.js"
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js"

export async function register({ full_name, email, password, phone_number, role }) {
    const existing = await db("users").where({ email }).first()
    if (existing) {
        throw new Error("User already exists with this email")
    }

    const hash = await bcrypt.hash(password, 10)

    const [user] = await db("users")
        .insert({
            full_name,
            email,
            password: hash,
            phone_number,
            role: role || "client",
            is_active: false,
        })
        .returning("*")

    const code = generateOtp()
    await saveOtp(user.id, code)
    await sendOtpToEmail(user.email, code)

    return { userId: user.id, otpSent: true }
}

export async function verifyOtp({ email, code }) {
    const user = await db("users").where({ email }).first()
    if (!user) {
        throw new Error("User not found")
    }

    const otpRecord = await db("otps")
        .where({ user_id: user.id, code, is_used: false })
        .orderBy("created_at", "desc")
        .first()

    if (!otpRecord) {
        throw new Error("Invalid OTP")
    }

    if (new Date() > otpRecord.expires_at) {
        throw new Error("OTP expired")
    }

    await db("otps")
        .where({ id: otpRecord.id })
        .update({ is_used: true })

    await db("users")
        .where({ id: user.id })
        .update({ is_active: true })

    return {
        success: true,
    }
}

export async function resendOtp({ email }) {
    const user = await db("users").where({ email }).first()
    if (!user) {
        throw new Error("User not found")
    }

    if (user.is_active === true) {
        throw new Error("User already verified")
    }

    const code = generateOtp()

    await saveOtp(user.id, code)
    await sendOtpToEmail(user.email, code)

    return { success: true }
}

export async function login({ email, password }) {
    const user = await db("users").where({ email }).first()
    if (!user) {
        throw new Error("User not found")
    }

    if (!user.is_active) {
        throw new Error("User is not verified. Please verify OTP first.")
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error("Invalid password")
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role })
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role })

    await db("users")
        .where({ id: user.id })
        .update({ refresh_token: refreshToken })

    return {
        accessToken,
        refreshToken,
    }
}

export async function myProfile(userId) {
    return await db("users")
        .select("id", "full_name", "email", "role", "is_active", "created_at")
        .where({ id: userId })
        .first()
}

export async function refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
        throw new Error("Refresh token required")
    }

    const user = await db("users").where({ refresh_token: oldRefreshToken }).first()
    if (!user) {
        throw new Error("Invalid refresh token")
    }

    let decoded
    try {
        decoded = verifyToken(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        throw new Error("Refresh token expired")
    }

    const newAccessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role,
    })

    const newRefreshToken = generateRefreshToken({
        id: decoded.id,
        role: decoded.role,
    })

    await db("users")
        .where({ id: user.id })
        .update({ refresh_token: newRefreshToken })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

export async function logout(userId, refreshToken) {
    const user = await db("users").where({ id: userId }).first()

    if (user.refresh_token !== refreshToken) {
        throw new Error("Invalid refresh token")
    }

    await db("users")
        .where({ id: userId })
        .update({ refresh_token: null })

    return true
}