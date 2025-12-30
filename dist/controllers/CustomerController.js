"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCustomer = exports.getCustomer = void 0;
const GenerateToken_1 = require("../utils/GenerateToken");
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const getCustomer = (req, res) => {
    res.status(200).json("Get Request Customer");
};
exports.getCustomer = getCustomer;
const loginCustomer = async (req, res) => {
    try {
        const user = req.body;
        if (!user?.id || !user?.email) {
            return res.status(400).json({ message: "Invalid user data" });
        }
        const token = (0, GenerateToken_1.generateToken)(user);
        const refresh = (0, GenerateToken_1.refreshToken)(user);
        const updatedUser = await CustomerModel_1.default.findOneAndUpdate({ firebaseUid: user.id }, // ✅ real unique key
        {
            $set: {
                firebaseUid: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile,
                refreshToken: refresh,
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({
            message: "Customer login success",
            token,
            user: updatedUser,
        });
    }
    catch (err) {
        console.error("Login failed:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
exports.loginCustomer = loginCustomer;
