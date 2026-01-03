"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CustomerController_1 = require("../controllers/CustomerController");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const customerRouter = express_1.default.Router();
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "customer.log"), { flags: "a" });
customerRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
customerRouter.get("/get-customer", CustomerController_1.getCustomer);
customerRouter.post("/login-customer", CustomerController_1.loginCustomer);
customerRouter.post("/save-info", CustomerController_1.saveUserInfo);
customerRouter.get("/get-info", CustomerController_1.getUserInfoByEmail);
customerRouter.get("/get-name-info", CustomerController_1.getUserInfoByName);
customerRouter.get("/follow-user", CustomerController_1.followUser);
customerRouter.get("/follow-user-count", CustomerController_1.getFollowersCountByName);
customerRouter.get("/get-following-phosts", CustomerController_1.getFollowingPhosts);
exports.default = customerRouter;
