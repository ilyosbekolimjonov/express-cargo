import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRES,
    });
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRES,
    });
}

export function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}
