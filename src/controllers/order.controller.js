import * as OrderService from "../services/order.service.js"
import { createOrderSchema, updateOrderSchema, updateStatusSchema } from "../validations/order.validation.js"

export const OrderController = {
    async createOrder(req, res) {
        try {
            const clientId = req.user.id
            const validated = createOrderSchema.parse(req.body)
            const order = await OrderService.createOrder(clientId, validated)

            res.status(201).json({
                success: true,
                data: order,
            })
        } catch (err) {
            res.status(400).json({ success: false, message: err.message })
        }
    },

    async getAllOrders(req, res) {
        try {
            const { page: page, limit: limit } = req.query
            const result = await OrderService.getAllOrders(page, limit);

            res.json({
                success: true,
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: result.data,
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    },

    async getMyOrders(req, res) {
        try {
            const clientId = req.user.id
            const orders = await OrderService.getMyOrders(clientId)

            res.json({
                success: true,
                data: orders,
            })
        } catch (err) {
            res.status(400).json({ success: false, message: err.message })
        }
    },

    async getOrderById(req, res) {
        try {
            const clientId = req.user.id
            const { id } = req.params

            const order = await OrderService.getOrderById(clientId, id)

            res.json({
                success: true,
                data: order,
            })
        } catch (err) {
            res.status(404).json({ success: false, message: err.message })
        }
    },

    async updateOrder(req, res) {
        try {
            const clientId = req.user.id
            const { id } = req.params
            const validated = updateOrderSchema.parse(req.body)
            const updated = await OrderService.updateOrder(clientId, id, validated)

            res.json({
                success: true,
                data: updated,
            })
        } catch (err) {
            res.status(400).json({ success: false, message: err.message })
        }
    },

    async deleteOrder(req, res) {
        try {
            const clientId = req.user.id
            const { id } = req.params

            await OrderService.deleteOrder(clientId, id)

            res.json({ success: true, message: "Order deleted" })
        } catch (err) {
            res.status(400).json({ success: false, message: err.message })
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const clientId = req.user.id
            const { id } = req.params
            const { status } = updateStatusSchema.parse(req.body)

            const result = await OrderService.updateOrderStatus(clientId, id, status)

            res.json({
                success: true,
                data: result,
            })
        } catch (err) {
            res.status(400).json({ success: false, message: err.message })
        }
    },
}