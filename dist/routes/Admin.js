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
const Auth_1 = __importDefault(require("../middleware/Auth"));
const adminRouter = express_1.default.Router();
adminRouter.get("/get-stats", Auth_1.default, AdminDashboard_1.getDashboardStats);
adminRouter.get("/resole-login", Auth_1.default, AdminDashboard_1.deactivateEmail);
adminRouter.get("/get-reported-users", Auth_1.default, AdminDashboard_1.getReportedUsers);
adminRouter.get("/rejected-user", Auth_1.default, AdminDashboard_1.rejectUserByName);
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "admin.log"), { flags: "a" });
adminRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
exports.default = adminRouter;
