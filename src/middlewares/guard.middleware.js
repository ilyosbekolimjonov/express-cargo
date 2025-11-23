import jwt from "jsonwebtoken"

export function authGuard(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) throw new Error("No token provided")

        const token = authHeader.split(" ")[1]
        if (!token) throw new Error("Invalid token format")

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: " + err.message,
        })
    }
}


export function roleGuard(allowedRoles = []) {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role

            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: user role not found",
                })
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: insufficient permission",
                })
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
