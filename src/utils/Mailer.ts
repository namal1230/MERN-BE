import nodemailer from "nodemailer";

// Create transporter at module level
let transporter: nodemailer.Transporter;

const initMailer = async () => {
  transporter = nodemailer.createTransport({
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
export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
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
};