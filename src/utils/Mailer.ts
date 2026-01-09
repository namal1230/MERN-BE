import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  await transporter.verify();
  console.log("SendGrid transporter ready");

  return transporter;
};

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const mailer = await getTransporter();

  return mailer.sendMail({
    from: "namaldilmith2@gmail.com",
    to,
    subject,
    text,
    html,
  });
};
