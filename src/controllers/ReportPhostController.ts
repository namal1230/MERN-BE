import { Request, Response } from "express";
import mongoose from "mongoose";
import Report from "../models/ReportedPhostModel";
import { sendReportEmailAdmin } from "../services/email.service";

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

        await sendReportEmailAdmin({phostId,reporterEmail,reportType,reason,description,evidence,frequency});
        
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

export const getReportedPhostById = async (req: Request, res: Response) => {
  const { id } = req.query;
  console.log("trigger email")

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report id",
    });
  }

  try {
    const report = await Report.findById(id);

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
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reported phost",
    });
  }
};