import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { authGuard, refreshGuard, roleGuard } from '../middlewares/guard.js'
import { validate } from '../validations/validation.js'
import { createUserSchema } from '../validations/user.validation.js'
import { loginSchema } from '../validations/user.validation.js'
const router = Router()


router.get('/profile', authGuard, roleGuard('admin', 'deliveryStaff', 'customer'), authController.profile)
router.post('/signin', validate(loginSchema, 'body'), authController.signin)
router.post('/signup', validate(createUserSchema, 'body'), authController.signup)
router.post('/refresh', refreshGuard, authController.updateAccess)

export { router as authRouter }