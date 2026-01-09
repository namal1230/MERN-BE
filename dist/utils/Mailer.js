"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter;
const initMailer = async () => {
    try {
        transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.verify();
        console.log("Gmail transporter ready");
    }
    catch (err) {
        console.error("Error in nodemailer:", err);
    }
};
initMailer();
const sendMail = async (to, subject, text, html) => {
    try {
        if (!transporter) {
            throw new Error("Transporter not initialized yet");
        }
        const info = await transporter.sendMail({
            from: "Smart Blog Phost",
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent:", info.messageId);
        console.log("Preview URL:", nodemailer_1.default.getTestMessageUrl(info));
        return info;
    }
    catch (err) {
        console.error("Error in nodemailer:", err);
    }
};
exports.sendMail = sendMail;
