"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (users) => {
    const secret = process.env.SECRET_CODE;
    return jsonwebtoken_1.default.sign({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
    }, String(secret), { expiresIn: "30m" });
};
exports.generateToken = generateToken;
const refreshToken = (users) => {
    const secret = process.env.REFRESH_CODE;
    return jsonwebtoken_1.default.sign({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
    }, String(secret), { expiresIn: "7d" });
};
exports.refreshToken = refreshToken;
