import express from "express";
import { getImages } from "../controllers/ImageController";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import AuthVerfication from "../middleware/Auth";

const unsplash = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "unsplash.log"),
  { flags: "a" }
);

unsplash.use(morgan("tiny", { stream: accessLogStream }));

unsplash.get("/search",AuthVerfication, getImages);

export default unsplash;
