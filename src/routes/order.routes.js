import { Router } from "express"
import { authGuard, roleGuard } from "../middlewares/guard.middleware.js"
import { OrderController } from "../controllers/order.controller.js"

const router = Router()

router.post("/", authGuard, roleGuard(["admin", "client"]), OrderController.createOrder)
router.get("/", authGuard, roleGuard(["admin"]), OrderController.getAllOrders)
router.get("/my", authGuard, roleGuard(["admin", "client", "supplier"]), OrderController.getMyOrders)
router.get("/:id", authGuard, roleGuard(["admin", "client"]), OrderController.getOrderById)
router.put("/:id", authGuard, roleGuard(["admin"]), OrderController.updateOrder)
router.put("/status/:id", authGuard, roleGuard(["admin"]), OrderController.updateOrderStatus)
router.delete("/:id", authGuard, roleGuard(["admin"]), OrderController.deleteOrder)

export { router as orderRouter}