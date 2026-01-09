import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

const initMailer = async () => {
  try {
    transporter = nodemailer.createTransport({
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
  } catch (err) {
    console.error("Error in nodemailer:", err);
  }
};

initMailer();

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
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
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (err) {
    console.error("Error in nodemailer:", err);
  }
};