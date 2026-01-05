"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const Auth_1 = __importDefault(require("../middleware/Auth"));
const AIRouter = (0, express_1.Router)();
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "ai.log"), { flags: "a" });
AIRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
AIRouter.post("/generate-image", Auth_1.default, AIController_1.generateImage);
exports.default = AIRouter;
