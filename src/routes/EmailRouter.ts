import express from "express";
import { sendTestEmail } from "../controllers/EmailController";

const emailRouter = express.Router();

emailRouter.post("/send", sendTestEmail);

export default emailRouter;