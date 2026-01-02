import express, { Router } from "express";
import { imageUpload, vedioUpload } from "../controllers/UploadController";
import { upload } from "../middleware/multer";
import fs from "fs";
import path from "path";
import morgan from "morgan";

const uploadRouter = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "upload.log"),
  { flags: "a" }
);

uploadRouter.use(morgan("tiny", { stream: accessLogStream }));

uploadRouter.post("/image", upload.single("image"), imageUpload);
uploadRouter.post("/video", upload.single("vedio"), vedioUpload);

export default uploadRouter;