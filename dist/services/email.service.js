"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReportEmailAdmin = exports.sendLoginResponse = exports.sendReactionEmails = exports.sendLoginEmails = void 0;
const Mailer_1 = require("../utils/Mailer");
const EmailModel_1 = __importDefault(require("../models/EmailModel")); // adjust path if needed
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
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
const sendReactionEmails = async ({ phostId, reactedBy, reactionType, comment, }) => {
    const phost = await PhostsModel_1.default.findById(phostId).select("title email username");
    if (!phost)
        return null;
    if (phost.username === reactedBy)
        return null;
    let subject = "";
    let message = "";
    if (reactionType === "like") {
        subject = "Your Phost got a Like";
        message = `${reactedBy} liked your post.\n\n Post Title: ${phost.title} \n\nFrom: Smart Blog Phost`;
    }
    if (reactionType === "comment") {
        subject = "New Comment on Your Phost";
        message = `${reactedBy} commented on your post.\n\nPost Title: ${phost.title}\n\nComment:${comment}\n\nFrom: Smart Blog Phost`;
    }
    await (0, Mailer_1.sendMail)(phost.email, subject, message);
    return true;
};
exports.sendReactionEmails = sendReactionEmails;
const sendLoginResponse = async ({ email, description }) => {
    await (0, Mailer_1.sendMail)(email, "Admin Review For Login Issue", description);
    return true;
};
exports.sendLoginResponse = sendLoginResponse;
const sendReportEmailAdmin = async ({ phostId, reporterEmail, reportType, reason, description, evidence, frequency }) => {
    const adminMessage = `
     New Phost Report Submitted

    Phost ID: ${phostId}
    Reported By: ${reporterEmail}

    Report Type: ${reportType}
    Reason: ${reason}
    Frequency: ${frequency}

    Description:${description}

    Evidence:${evidence || "No evidence provided"}`;
    await (0, Mailer_1.sendMail)("namaldilmith2@gmail.com", "New Report Received", adminMessage);
};
exports.sendReportEmailAdmin = sendReportEmailAdmin;
