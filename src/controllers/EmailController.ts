import { Request, Response } from "express";
import { sendMail } from "../utils/Mailer";

export const sendTestEmail = async (req: Request, res: Response) => {
  const {description,email} = req.body;
    try {
    const info = await sendMail(
      "dilmithqwe@gmail.com", 
      "User Login Issue", 
      `${description} from ${email}`
    );

    res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};