import { Router } from "express"
import * as ClientAddressController from "../controllers/clientAddress.controller.js"
import { authGuard, roleGuard } from "../middlewares/guard.middleware.js"

const router = Router()

router.post("/", authGuard, roleGuard(["admin", "client",]), ClientAddressController.createAddress)
router.get("/", authGuard, roleGuard(["admin"]), ClientAddressController.getAllAddresses)
router.get("/my", authGuard, roleGuard(["admin", "client",]), ClientAddressController.getMyAddresses)
router.get("/:id", authGuard, roleGuard(["admin", "client",]), ClientAddressController.getAddressById)
router.put("/:id", authGuard, roleGuard(["admin", "client",]), ClientAddressController.updateAddress)
router.delete("/:id", authGuard, roleGuard(["admin", "client",]), ClientAddressController.deleteAddress)
router.patch("/:id", authGuard, roleGuard(["admin", "client",]), ClientAddressController.setDefaultAddress)

export { router as clientAdressRouter }
