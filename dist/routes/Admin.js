"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminDashboard_1 = require("../controllers/AdminDashboard");
const adminRouter = express_1.default.Router();
adminRouter.get("/get-stats", AdminDashboard_1.getDashboardStats);
exports.default = adminRouter;
