import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"
import { authGuard, roleGuard } from "../middlewares/guard.middleware.js"

const router = Router()

router.get("/", authGuard, roleGuard(["admin"]), UserController.getAllUsers)
router.get("/:id", authGuard, roleGuard(["admin"]), UserController.getSingleUser)
router.put("/:id", authGuard, roleGuard(["admin"]), UserController.updateUser)
router.delete("/:id", authGuard, roleGuard(["admin"]), UserController.removeUser)

export { router as userRouter}