"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailController_1 = require("../controllers/EmailController");
const emailRouter = express_1.default.Router();
emailRouter.post("/send", EmailController_1.sendTestEmail);
exports.default = emailRouter;
