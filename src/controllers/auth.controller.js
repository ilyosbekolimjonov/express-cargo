import * as authService from "../services/auth.service.js"
import { verifyOtpSchema, resendOtpSchema, registerUserSchema } from "../validations/auth.validation.js"

export const AuthController = {
    async register(req, res, next) {
        try {
            const validated = registerUserSchema.parse(req.body)
            const result = await authService.register(validated)
            res.status(201).json({
                message: "User registered. OTP sent to email.",
                data: result,
            })
        } catch (err) {
            next(err)
        }
    },

    async verifyOtp(req, res, next) {
        try {
            const validated = verifyOtpSchema.parse(req.body)
            const result = await authService.verifyOtp(validated)
            res.json({
                message: "OTP verified successfully",
                data: result,
            })
        } catch (err) {
            next(err)
        }
    },

    async resendOtp(req, res, next) {
        try {
            const validated = resendOtpSchema.parse(req.body)
            const result = await authService.resendOtp(validated)
            res.json({
                message: "OTP resent successfully",
                data: result,
            })
        } catch (err) {
            next(err)
        }
    },

    async login(req, res, next) {
        try {
            const result = await authService.login(req.body)
            res.json({
                message: "Logged in successfully",
                data: result,
            })
        } catch (err) {
            next(err)
        }
    },

    async myProfile(req, res, next) {
        try {
            const user = await authService.myProfile(req.user.id)
            res.json({
                message: "Profile fetched",
                data: user,
            })
        } catch (err) {
            next(err)
        }
    },

    async logout(req, res, next) {
        try {
            await authService.logout(req.user.id, req.body.refreshToken)
            res.json({ message: "Logged out successfully" })
        } catch (err) {
            next(err)
        }
    },

    async refreshToken(req, res, next) {
        try {
            const result = await authService.refreshToken(req.body.refreshToken)
            res.json({
                message: "New access token generated",
                data: result,
            })
        } catch (err) {
            next(err)
        }
    },
} 