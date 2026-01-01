import { Request, Response } from "express";
import mongoose from "mongoose";
import Report from "../models/ReportedPhostModel";

export const reportPhost = async (req: Request, res: Response) => {

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
        const {
            reportType,
            reason,
            description,
            evidence,
            frequency,
            acknowledge,
        } = req.body;

        if (
            !reportType ||
            !reason ||
            !description ||
            !frequency ||
            acknowledge !== true
        ) {
            return res.status(400).json({
                message: "All required fields must be provided and acknowledged",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(phostId)) {
            return res.status(400).json({
                message: "Invalid phostId",
            });
        }

        // const reporterEmail = (req as any).user?.email;

        if (reporterEmail) {
            const existingReport = await Report.findOne({
                phostId,
                reporterEmail,
            });

            if (existingReport) {
                return res.status(409).json({
                    message: "You have already reported this post",
                });
            }
        }

        const newReport = await Report.create({
            phostId,
            reporterEmail,
            reportType,
            reason,
            description,
            evidence,
            frequency,
            acknowledge,
        });

        return res.status(201).json({
            message: "Phost reported successfully",
            report: newReport,
        });
    } catch (error) {
        console.error("Report phost error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};