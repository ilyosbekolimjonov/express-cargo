import knex from "../db/knex.js";
import { sendOtpEmail } from "../utils/mailer.js";

export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOtp(userId, code) {
    const expiresAt = new Date(Date.now() + 1000 * 60);

    await knex("otps").insert({
        user_id: userId,
        code,
        expires_at: expiresAt,
        is_used: false,
    });
}

export async function sendOtpToEmail(email, code) {
    await sendOtpEmail(email, code);
}
