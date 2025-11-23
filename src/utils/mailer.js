import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export async function sendOtpEmail(to, code) {
    await mailer.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${code}`,
    });
}
