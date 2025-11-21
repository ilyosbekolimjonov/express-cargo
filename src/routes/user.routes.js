import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authGuard, roleGuard } from "../middlewares/guard.js";

const router = Router();

router.post("/", authGuard, roleGuard("admin"), userController.create);
router.get("/", authGuard, roleGuard(["admin", "operator"]), userController.getAll);
router.get("/:id", authGuard, roleGuard(["admin", "operator"]), userController.getById);
router.put("/:id", authGuard, roleGuard("admin"), userController.update);
router.delete("/:id", authGuard, roleGuard("admin"), userController.remove);

export {router as UserRouter};