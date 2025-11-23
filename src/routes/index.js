import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { orderRouter } from "./order.routes.js";
import { clientAdressRouter } from "./clientAdddress.routes.js";

const router = Router()

router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/orders", orderRouter)
router.use("/addresses", clientAdressRouter)

export default router