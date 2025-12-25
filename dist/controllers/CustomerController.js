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
        console.log(req.body);
        const user = req.body;
        const token = (0, GenerateToken_1.generateToken)(user);
        const refresh = (0, GenerateToken_1.refreshToken)(user);
        const updatedUser = await CustomerModel_1.default.findOneAndUpdate({ firebaseUid: user.id }, // unique identifier
        {
            $set: {
                name: user.name,
                email: user.email,
                profile: user.profile,
                refreshToken: refresh,
            },
        }, {
            new: true, // return updated document
            upsert: true // create if not exists
        });
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        res.status(200).json({ data: "Customer login Success", token });
    }
    catch (err) {
        console.error("Login failed:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
exports.loginCustomer = loginCustomer;
