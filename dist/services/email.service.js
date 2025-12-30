"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLoginEmails = void 0;
const Mailer_1 = require("../utils/Mailer");
const EmailModel_1 = __importDefault(require("../models/EmailModel")); // adjust path if needed
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
// export const handleLoginIssueEmail = async ({
//   email,
//   description
// }: SendLoginIssueEmailParams) => {
//     const info = await sendMail(
//         "dilmithqwe@gmail.com", 
//         "User Login Issue", 
//         `${description}\n\nFrom: ${email}`
//     );
// };
const sendLoginEmails = async ({ email, description, status }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (status == "login-issue") {
        const user = await CustomerModel_1.default.findOne({ email: normalizedEmail }).select("profile");
        const emailData = {
            email: normalizedEmail,
            source: "login-issue",
            title: user ? "Existing User Login" : "New User Login",
            body: description,
            loginType: user ? "existing" : "new",
            userProfile: user?.profile
        };
        const savedEmail = await EmailModel_1.default.create(emailData);
        await (0, Mailer_1.sendMail)("dilmithqwe@gmail.com", "User Login Issue", `${description}\n\nFrom: ${email}`);
        return savedEmail;
    }
    if (status == "phost-upload") {
        await (0, Mailer_1.sendMail)("dilmithqwe@gmail.com", "Phost Uploaded", `Title: ${description}\n\nFrom: ${email}`);
    }
    if (status == "phost-published") {
        await (0, Mailer_1.sendMail)(email, "Phost Published", `Title: ${description}\n\nFrom: Samrt Blog Phost`);
    }
    if (status == "phost-rejected") {
        await (0, Mailer_1.sendMail)(email, "Phost Rejected", `Title: ${description}\n\nFrom: Samrt Blog Phost`);
    }
};
exports.sendLoginEmails = sendLoginEmails;
