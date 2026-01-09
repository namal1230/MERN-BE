import { Request, Response } from "express";
import Email from "../models/EmailModel";
import { sendLoginEmails } from "../services/email.service";

export const sendLoginEmail = async (req: Request, res: Response) => {
  const { description, email } = req.body;

  if (!email || !description) {
    return res.status(400).json({ message: "Email and description are required" });
  }

  try {

    const status = "login-issue";
    const emailSender = await sendLoginEmails({email,description,status});
    res.status(200).json({
      message: "Email sent successfully",
      data: emailSender
    });
  } catch (error:any) {
   console.error("sendLoginEmail controller error:");
  console.error(error?.message);
  console.error(error?.stack);

  res.status(500).json({
    error: error?.message || "Failed to send email",
  });
  }
};

export const getEmails = async (req: Request, res: Response) => {
  const { status } = req.query;

  if (!status || typeof status !== "string") {
    return res.status(400).json({ message: "status query is required" });
  }

  try {
    const emails = await Email.find({ 
      source: status,
      status: true 
    }).sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
};
