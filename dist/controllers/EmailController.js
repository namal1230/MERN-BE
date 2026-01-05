"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmails = exports.sendLoginEmail = void 0;
const EmailModel_1 = __importDefault(require("../models/EmailModel"));
const email_service_1 = require("../services/email.service");
const sendLoginEmail = async (req, res) => {
    const { description, email } = req.body;
    if (!email || !description) {
        return res.status(400).json({ message: "Email and description are required" });
    }
    try {
        const status = "login-issue";
        const emailSender = await (0, email_service_1.sendLoginEmails)({ email, description, status });
        res.status(200).json({
            message: "Email sent successfully",
            data: emailSender
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
};
exports.sendLoginEmail = sendLoginEmail;
const getEmails = async (req, res) => {
    const { status } = req.query;
    if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "status query is required" });
    }
    try {
        const emails = await EmailModel_1.default.find({
            source: status,
            status: true
        }).sort({ createdAt: -1 });
        res.status(200).json(emails);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch emails" });
    }
};
exports.getEmails = getEmails;
