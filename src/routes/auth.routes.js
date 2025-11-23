import { Router } from "express"
import { AuthController } from "../controllers/auth.controller.js"
import { authGuard } from "../middlewares/guard.middleware.js"

const router = Router()

router.post("/signup", AuthController.register)
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/resend-otp", AuthController.resendOtp)
router.post("/login", AuthController.login)

router.get("/me", authGuard, AuthController.myProfile)
router.post("/logout", authGuard, AuthController.logout)
router.post("/refresh-token", AuthController.refreshToken)

export { router as authRouter }