"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UploadController_1 = require("../controllers/UploadController");
const multer_1 = require("../middleware/multer");
const uploadRouter = express_1.default.Router();
uploadRouter.post("/image", multer_1.upload.single("image"), UploadController_1.imageUpload);
uploadRouter.post("/video", multer_1.upload.single("vedio"), UploadController_1.vedioUpload);
exports.default = uploadRouter;
