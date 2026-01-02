import { Router } from "express";
import { generateImage } from "../controllers/AIController";
import fs from "fs";
import path from "path";
import morgan from "morgan";

const AIRouter = Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "ai.log"),
  { flags: "a" }
);

AIRouter.use(morgan("tiny", { stream: accessLogStream }));


AIRouter.post("/generate-image", generateImage);

export default AIRouter;
