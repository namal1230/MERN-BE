import express from "express";
import { sendLoginEmail,getEmails } from "../controllers/EmailController";

const emailRouter = express.Router();

emailRouter.post("/send", sendLoginEmail);
emailRouter.get("/get", getEmails);

export default emailRouter;