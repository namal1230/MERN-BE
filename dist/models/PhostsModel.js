"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BodyBlockSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, { _id: false });
const PhostsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: [BodyBlockSchema],
        required: true
    },
    code: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "published", "archived"],
        default: "pending",
        lowercase: true,
    },
}, { timestamps: true });
const Phosts = mongoose_1.default.model("Phosts", PhostsSchema);
exports.default = Phosts;
