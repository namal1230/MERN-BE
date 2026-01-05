"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthVerfication = (req, resp, next) => {
    const auth = req.headers.authorization;
    console.log("Headers:", req.headers);
    if (!auth || !auth.startsWith("Bearer ")) {
        resp.status(401).json("Not Verfied Authentication");
    }
    const token = auth?.split(" ")[1];
    if (!token) {
        return resp.status(401).json({ message: "Token missing" });
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_CODE);
    next();
};
exports.default = AuthVerfication;
