"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthVerfication = (req, resp, next) => {
    const secret = process.env.SECRET_CODE;
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        console.log(auth);
        return resp.status(401).json({ message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    console.log(token);
    try {
        const status = jsonwebtoken_1.default.verify(String(token), String(secret));
        req.user = status;
        console.log(status);
        next();
    }
    catch (err) {
        resp.status(403).json("Forbidden Error");
    }
};
exports.default = AuthVerfication;
