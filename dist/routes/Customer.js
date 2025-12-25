"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CustomerController_1 = require("../controllers/CustomerController");
const customerRouter = express_1.default.Router();
customerRouter.get("/get-customer", CustomerController_1.getCustomer);
customerRouter.post("/login-customer", CustomerController_1.loginCustomer);
exports.default = customerRouter;
