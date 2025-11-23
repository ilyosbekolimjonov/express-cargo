import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { orderRouter } from "./order.routes.js";

const router = Router()

router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/orders", orderRouter)

export default router