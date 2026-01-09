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
        return resp.status(401).json("Not Verfied Authentication");
    }
    console.log("Now checked hraders..");
    const token = auth?.split(" ")[1];
    console.log("token");
    if (!token) {
        return resp.status(401).json({ message: "Token missing" });
    }
    console.log("now token is verified");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_CODE);
        console.log("Now coorect decoded.." + decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        return resp.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
exports.default = AuthVerfication;
