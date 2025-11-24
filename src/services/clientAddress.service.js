import db from "../db/knex.js"
import { paginate } from "../utils/pagination.js"

export async function createAddress(clientId, data) {
    const { title, country, city, province, street, zip_code, is_default } = data

    if (is_default) {
        await db("client_addresses")
            .where({ client_id: clientId })
            .update({ is_default: false })
    }

    const [address] = await db("client_addresses")
        .insert({
            client_id: clientId,
            title,
            country,
            city,
            province,
            street,
            zip_code,
            is_default: is_default ? true : false,
        })
        .returning("*")

    return address
}

export async function getAllAddresses(page, limit) {
    const { page: currentPage, limit: take, offset } = paginate(page, limit)
    const [{ count }] = await db("client_addresses").count("* as count")

    const addresses = await db("client_addresses")
        .select("*")
        .limit(take)
        .offset(offset)

    return {
        page: currentPage,
        limit: take,
        total: Number(count),
        data: addresses
    }
}

export async function getMyAddresses(clientId) {
    return await db("client_addresses")
        .where({ client_id: clientId })
        .orderBy("created_at", "desc")
}

export async function getAddressById(clientId, id) {
    const address = await db("client_addresses")
        .where({ id, client_id: clientId })
        .first()

    if (!address) {
        throw new Error("Address not found")
    }

    return address
}

export async function updateAddress(clientId, id, data) {
    const address = await db("client_addresses")
        .where({ id, client_id: clientId })
        .first()

    if (!address) {
        throw new Error("Address not found")
    }

    const updateData = { ...data, updated_at: db.fn.now() }

    if (data.is_default === true) {
        await db("client_addresses")
            .where({ client_id: clientId })
            .update({ is_default: false })
    }

    const [updated] = await db("client_addresses")
        .where({ id })
        .update(updateData)
        .returning("*")

    return updated
}

export async function deleteAddress(clientId, id) {
    const address = await db("client_addresses")
        .where({ id, client_id: clientId })
        .first()

    if (!address) {
        throw new Error("Address not found")
    }

    await db("client_addresses").where({ id }).delete()

    return true
}

export async function setDefaultAddress(clientId, id) {
    const address = await db("client_addresses")
        .where({ id, client_id: clientId })
        .first()

    if (!address) {
        throw new Error("Address not found")
    }

    await db("client_addresses")
        .where({ client_id: clientId })
        .update({ is_default: false })

    const [updated] = await db("client_addresses")
        .where({ id })
        .update({ is_default: true, updated_at: db.fn.now() })
        .returning("*")

    return updated
}
