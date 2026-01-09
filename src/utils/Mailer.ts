import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

const initMailer = async () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.verify();
    console.log("Gmail transporter ready");

    return transporter;
  } catch (err) {
    console.error("Error in nodemailer:", err);
  }
};

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    if (!transporter) {
      throw new Error("Transporter not initialized yet");
    }

    const mailer = await initMailer();

    if(!mailer===undefined){
      
    }

    const info = await mailer?.sendMail({
      from: `"Smart Blog Phost" ${process.env.EMAIL_USER}`,
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