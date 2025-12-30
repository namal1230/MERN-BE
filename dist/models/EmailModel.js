"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmailSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    source: {
        type: String,
        enum: ["login-issue", "phost-upload", "report-user", "report-phost"],
        required: true
    },
    title: {
        type: String,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    loginType: {
        type: String,
        enum: ["new", "existing"],
        required: false // optional, only for login-issue
    },
    userProfile: {
        type: String, // store profile image URL
        required: false
    }
}, {
    timestamps: true // auto adds createdAt & updatedAt
});
exports.default = mongoose_1.default.model("Email", EmailSchema);
