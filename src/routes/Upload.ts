import express from "express";
import { imageUpload, vedioUpload } from "../controllers/UploadController";
import { upload } from "../middleware/multer";

const uploadRouter = express.Router();

uploadRouter.post("/image", upload.single("image"), imageUpload);
uploadRouter.post("/video", upload.single("vedio"), vedioUpload);

export default uploadRouter;