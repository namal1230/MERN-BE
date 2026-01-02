"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UploadController_1 = require("../controllers/UploadController");
const multer_1 = require("../middleware/multer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const uploadRouter = express_1.default.Router();
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "upload.log"), { flags: "a" });
uploadRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
uploadRouter.post("/image", multer_1.upload.single("image"), UploadController_1.imageUpload);
uploadRouter.post("/video", multer_1.upload.single("vedio"), UploadController_1.vedioUpload);
exports.default = uploadRouter;
