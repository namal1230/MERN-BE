import express from "express";
import { sendLoginEmail,getEmails } from "../controllers/EmailController";
import fs from "fs";
import path from "path";
import morgan from "morgan";

const emailRouter = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "email.log"),
  { flags: "a" }
);

emailRouter.use(morgan("tiny", { stream: accessLogStream }));



emailRouter.post("/send", sendLoginEmail);
emailRouter.get("/get", getEmails);

export default emailRouter;