import { Router } from "express";
import { UserRouter } from "./user.routes.js";
import { authRouter } from "./auth.routes.js";

const router = Router();

router.use("/users", UserRouter);
router.use("/auth", authRouter)

export default router;