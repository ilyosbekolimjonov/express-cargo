import * as ClientAddressService from "../services/clientAddress.service.js"

export async function createAddress(req, res) {
    try {
        const clientId = req.user.id
        const data = req.body

        const address = await ClientAddressService.createAddress(clientId, data)

        res.status(201).json({
            success: true,
            data: address,
        })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export async function getAllAddresses(req, res) {
    try {
        const { page, limit } = req.query
        const result = await ClientAddressService.getAllAddresses(page, limit)

        res.json({
            success: true,
            page: result.page,
            limit: result.limit,
            total: result.total,
            data: result.data,
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}

export async function getMyAddresses(req, res) {
    try {
        const clientId = req.user.id

        const list = await ClientAddressService.getMyAddresses(clientId)

        res.json({
            success: true,
            data: list,
        })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export async function getAddressById(req, res) {
    try {
        const clientId = req.user.id
        const { id } = req.params

        const address = await ClientAddressService.getAddressById(clientId, id)

        res.json({
            success: true,
            data: address,
        })
    } catch (err) {
        res.status(404).json({ success: false, message: err.message })
    }
}

export async function updateAddress(req, res) {
    try {
        const clientId = req.user.id
        const { id } = req.params
        const data = req.body

        const updated = await ClientAddressService.updateAddress(clientId, id, data)

        res.json({
            success: true,
            data: updated,
        })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export async function deleteAddress(req, res) {
    try {
        const clientId = req.user.id
        const { id } = req.params

        await ClientAddressService.deleteAddress(clientId, id)

        res.json({ success: true, message: "Address deleted" })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export async function setDefaultAddress(req, res) {
    try {
        const clientId = req.user.id
        const { id } = req.params

        const result = await ClientAddressService.setDefaultAddress(clientId, id)

        res.json({
            success: true,
            data: result,
        })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}
