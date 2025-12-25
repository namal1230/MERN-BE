"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create transporter at module level
let transporter;
const initMailer = async () => {
    transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465
        auth: {
            user: "namaldilmith2@gmail.com",
            pass: "dwgceokezsfuaath",
        },
    });
    await transporter.verify();
    console.log("✅ Gmail transporter ready");
};
initMailer(); // Initialize transporter
// Send email function
const sendMail = async (to, subject, text, html) => {
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
};
exports.sendMail = sendMail;
