"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportedPhostById = exports.reportPhost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReportedPhostModel_1 = __importDefault(require("../models/ReportedPhostModel"));
const email_service_1 = require("../services/email.service");
const reportPhost = async (req, res) => {
    const { id, email } = req.query;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "phost id is required" });
    }
    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "email is required" });
    }
    const phostId = id;
    const reporterEmail = email;
    try {
        const { reportType, reason, description, evidence, frequency, acknowledge, } = req.body;
        if (!reportType ||
            !reason ||
            !description ||
            !frequency ||
            acknowledge !== true) {
            return res.status(400).json({
                message: "All required fields must be provided and acknowledged",
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(phostId)) {
            return res.status(400).json({
                message: "Invalid phostId",
            });
        }
        // const reporterEmail = (req as any).user?.email;
        if (reporterEmail) {
            const existingReport = await ReportedPhostModel_1.default.findOne({
                phostId,
                reporterEmail,
            });
            if (existingReport) {
                return res.status(409).json({
                    message: "You have already reported this post",
                });
            }
        }
        const newReport = await ReportedPhostModel_1.default.create({
            phostId,
            reporterEmail,
            reportType,
            reason,
            description,
            evidence,
            frequency,
            acknowledge,
        });
        await (0, email_service_1.sendReportEmailAdmin)({ phostId, reporterEmail, reportType, reason, description, evidence, frequency });
        return res.status(201).json({
            message: "Phost reported successfully",
            report: newReport,
        });
    }
    catch (error) {
        console.error("Report phost error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.reportPhost = reportPhost;
const getReportedPhostById = async (req, res) => {
    const { id } = req.query;
    if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid report id",
        });
    }
    try {
        const report = await ReportedPhostModel_1.default.findById(id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Reported phost not found",
            });
        }
        res.status(200).json({
            success: true,
            data: report,
        });
    }
    catch (error) {
        console.error("Get report error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reported phost",
        });
    }
};
exports.getReportedPhostById = getReportedPhostById;
