"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userInfoSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    bio: {
        type: String,
        default: ""
    },
    jobTitle: {
        type: String,
        default: "",
    },
    experienceYears: {
        type: String,
        default: ""
    },
    portfolioUrl: {
        type: String,
        default: ""
    },
    githubUrl: {
        type: String,
        default: "",
    },
    linkdinUrl: {
        type: String,
        default: "",
    },
    anotherUrl: {
        type: String,
        default: "",
    },
    skills: {
        type: [String],
        default: []
    },
    profileUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });
const UserInfo = mongoose_1.default.model("UserInfo", userInfoSchema);
exports.default = UserInfo;
