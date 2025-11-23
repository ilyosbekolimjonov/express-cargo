import { z } from "zod"

export const registerUserSchema = z.object({
    full_name: z
        .string()
        .optional(),
    email: z
        .string()
        .trim()
        .email("Email noto'g'ri formatda")
        .min(5, "Email juda qisqa"),

    phone_number: z
        .string()
        .optional(),

    password: z
        .string()
        .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),

    role: z
        .enum(["admin", "client", "supplier"])
        .optional(),
})

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .email("Email noto'g'ri formatda"),

    code: z
        .string()
        .regex(/^[0-9]{6}$/, "OTP faqat 6 xonali raqam bo'lishi kerak"),
})

export const resendOtpSchema = z.object({
    email: z
        .string()
        .email("Email noto'g'ri formatda"),
})

export const loginSchema = z.object({
    email: z
        .string()
        .email("Email noto'g'ri formatda"),

    password: z
        .string()
        .min(6, "Parol noto'g'ri"),
})
