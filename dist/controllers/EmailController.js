"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestEmail = void 0;
const Mailer_1 = require("../utils/Mailer");
const sendTestEmail = async (req, res) => {
    const { description, email } = req.body;
    try {
        const info = await (0, Mailer_1.sendMail)("dilmithqwe@gmail.com", "User Login Issue", `${description} from ${email}`);
        res.status(200).json({
            message: "Email sent successfully",
            messageId: info.messageId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
};
exports.sendTestEmail = sendTestEmail;
