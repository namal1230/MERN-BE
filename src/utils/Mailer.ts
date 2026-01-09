import sgMail, { MailDataRequired } from "@sendgrid/mail";


export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is missing");
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const msg: MailDataRequired = {
      to,
      from: {
        email: "namaldilmith2@gmail.com",
        name: "Smart Blog Phost",
      },
      subject,
      text,
      html: html || "",
    };

    await sgMail.send(msg);
    console.log("Email sent via SendGrid API");

  } catch (error: any) {
    console.error("SendGrid API error:", error.response?.body || error);
    throw error;
  }
};
