"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firebaseUid: {
        type: "String",
        unique: true,
        require: true
    },
    name: {
        type: "String",
        unique: true,
        require: true
    },
    email: {
        type: "String",
        unique: true,
        require: true
    },
    profile: {
        type: "String",
        unique: true,
        require: true
    },
    refreshToken: {
        type: "String",
        unique: true,
        require: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["VALID", "REJECTED", "Reported"],
        default: "VALID",
    },
}, { timestamps: true });
const Users = mongoose_1.default.model("User", UserSchema);
exports.default = Users;
