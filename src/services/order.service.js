import knex from "../db/knex.js"

export async function createOrder(clientId, data) {
    const { product_link, quantity, current_price, currency_type, truck, description } = data

    const [order] = await knex("orders")
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

export async function getAllOrders() {
    return await knex("orders")
        .select("*")
        .orderBy("created_at", "desc");
}

export async function getMyOrders(clientId) {
    return await knex("orders")
        .where({ client_id: clientId })
        .orderBy("created_at", "desc")
}

export async function getOrderById(clientId, orderId) {
    const order = await knex("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    return order
}

export async function updateOrder(clientId, orderId, data) {
    const order = await knex("orders")
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

    updateData.updated_at = knex.fn.now()

    const [updated] = await knex("orders")
        .where({ id: orderId })
        .update(updateData)
        .returning("*")

    return updated
}

export async function deleteOrder(clientId, orderId) {
    const order = await knex("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    await knex("orders").where({ id: orderId }).delete()

    return true
}

export async function updateOrderStatus(clientId, orderId, status) {
    
    const order = await knex("orders")
        .where({ id: orderId, client_id: clientId })
        .first()

    if (!order) {
        throw new Error("Order not found")
    }

    const validStatuses = ["accepted", "in_progres", "delivered"]

    if (!validStatuses.includes(status)) {
        throw new Error("Invalid order status")
    }

    const [updated] = await knex("orders")
        .where({ id: orderId })
        .update({
            status,
            updated_at: knex.fn.now(),
        })
        .returning("*")

    return updated
}
