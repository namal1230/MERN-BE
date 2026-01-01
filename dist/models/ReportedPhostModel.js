"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ReportSchema = new mongoose_1.Schema({
    phostId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Phost",
        required: true,
    },
    // 🟢 Reporter Email (used to prevent duplicate reports)
    reporterEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    reportType: {
        type: String,
        enum: ["POST", "COMMENT", "USER"],
        required: true,
    },
    reason: {
        type: String,
        enum: ["HARASSMENT", "SPAM", "HATE", "VIOLENCE", "OTHER"],
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    evidence: {
        type: String,
        trim: true,
    },
    frequency: {
        type: String,
        enum: ["ONCE", "MULTIPLE"],
        required: true,
    },
    acknowledge: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
ReportSchema.index({ phostId: 1, reporterEmail: 1 }, { unique: true });
const Report = mongoose_1.default.model("Report", ReportSchema);
exports.default = Report;
