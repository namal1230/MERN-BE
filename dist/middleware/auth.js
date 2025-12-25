"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthVerfication = (req, resp, next) => {
    const secret = process.env.SECRET_CODE;
    const auth = req.headers.authorization;
    if (!auth) {
        resp.status(401).json("Not Verfied Authentication");
    }
    const token = auth?.split(" ")[1];
    try {
        const status = jsonwebtoken_1.default.verify(String(secret), String(auth));
        if (status) {
            next();
        }
    }
    catch (err) {
        resp.status(403).json("Forbidden Error");
    }
};
exports.default = AuthVerfication;
