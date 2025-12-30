import { sendMail } from "../utils/Mailer";
import Email from "../models/EmailModel"; // adjust path if needed
import Users from "../models/CustomerModel";
import { stat } from "node:fs";

interface SendLoginIssueEmailParams {
    email: string;
    description: string;
    status: string;
}

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

export const sendLoginEmails = async ({ email,
    description, status }: SendLoginIssueEmailParams) => {

    const normalizedEmail = email.trim().toLowerCase();

    if (status == "login-issue") {
        const user = await Users.findOne({ email: normalizedEmail }).select("profile");

        const emailData: any = {
            email: normalizedEmail,
            source: "login-issue",
            title: user ? "Existing User Login" : "New User Login",
            body: description,
            loginType: user ? "existing" : "new",
            userProfile: user?.profile
        };

        const savedEmail = await Email.create(emailData);

        await sendMail(
            "dilmithqwe@gmail.com",
            "User Login Issue",
            `${description}\n\nFrom: ${email}`
        );
        return savedEmail;
    }

    if (status == "phost-upload"){
        await sendMail(
            "dilmithqwe@gmail.com",
            "Phost Uploaded",
            `Title: ${description}\n\nFrom: ${email}`
        );
    }

    if (status == "phost-published"){
        await sendMail(
            email,
            "Phost Published",
            `Title: ${description}\n\nFrom: Samrt Blog Phost`
        );
    }

    if (status == "phost-rejected"){
        await sendMail(
            email,
            "Phost Rejected",
            `Title: ${description}\n\nFrom: Samrt Blog Phost`
        );
    }
};



