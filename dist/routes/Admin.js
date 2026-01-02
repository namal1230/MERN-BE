"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminDashboard_1 = require("../controllers/AdminDashboard");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const adminRouter = express_1.default.Router();
adminRouter.get("/get-stats", AdminDashboard_1.getDashboardStats);
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "admin.log"), { flags: "a" });
adminRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
exports.default = adminRouter;
