import db from "../db/knex.js"
import { paginate } from "../utils/pagination.js"

export async function createOrder(clientId, data) {
    const { product_link, quantity, current_price, currency_type, truck, description } = data

    const [order] = await db("orders")
        .insert({
            client_id: clientId,
            product_link,
            quantity,
            current_price,
            currency_type,
            truck,
            description,
        })
        .returning("*")

    return order
}

export async function getAllOrders(page, limit) {
    const { page: currentPage, limit: take, offset } = paginate(page, limit)

    const [{ count }] = await db("orders").count("* as count")

    const orders = await db("orders")
        .select("*")
        .limit(take)
        .offset(offset)


    return {
        page: currentPage,
        limit: take,
        total: Number(count),
        data: orders
    }
}

export async function getMyOrders(clientId) {
    return await db("orders")
        .where({ client_id: clientId })
        .orderBy("created_at", "desc")
}

export async function getOrderById(clientId, orderId) {
    const order = await db("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    return order
}

export async function updateOrder(clientId, orderId, data) {
    const order = await db("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    const allowedFields = [
        "product_link",
        "quantity",
        "current_price",
        "currency_type",
        "truck",
        "description",
    ]

    const updateData = {}
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key]
        }
    }

    updateData.updated_at = db.fn.now()

    const [updated] = await db("orders")
        .where({ id: orderId })
        .update(updateData)
        .returning("*")

    return updated
}

export async function deleteOrder(clientId, orderId) {
    const order = await db("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    await db("orders").where({ id: orderId }).delete()

    return true
}

export async function updateOrderStatus(clientId, orderId, status) {

    const order = await db("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    const validStatuses = ["accepted", "in_progres", "delivered"]

    if (!validStatuses.includes(status)) {
        throw new Error("Invalid order status")
    }

    const [updated] = await db("orders")
        .where({ id: orderId })
        .update({
            status,
            updated_at: db.fn.now(),
        })
        .returning("*")

    return updated
}
