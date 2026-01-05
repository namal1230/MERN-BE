"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectUserByName = exports.getReportedUsers = exports.deactivateEmail = exports.getDashboardStats = void 0;
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
const EmailModel_1 = __importDefault(require("../models/EmailModel"));
const email_service_1 = require("../services/email.service");
const ReportedPhostModel_1 = __importDefault(require("../models/ReportedPhostModel"));
const getDashboardStats = async (req, res) => {
    console.log("get-request");
    try {
        const [validUsers, rejectedUsers, reportedUsers] = await Promise.all([
            CustomerModel_1.default.countDocuments({ status: 'VALID' }),
            CustomerModel_1.default.countDocuments({ status: 'REJECTED' }),
            CustomerModel_1.default.countDocuments({ status: 'Reported' }),
        ]);
        const phostStats = await PhostsModel_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const phosts = {
            published: 0,
            unlisted: 0,
            pending: 0,
        };
        phostStats.forEach((p) => {
            if (p._id === 'published')
                phosts.published = p.count;
            if (p._id === 'archived')
                phosts.unlisted = p.count;
            if (p._id === 'pending')
                phosts.pending = p.count;
        });
        res.json({
            users: {
                valid: validUsers,
                rejected: rejectedUsers,
                reported: reportedUsers
            },
            phosts,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const deactivateEmail = async (req, res) => {
    try {
        const emailId = req.query.emailId;
        const message = req.query.message || "";
        if (!emailId) {
            return res.status(400).json({ message: "Email ID is required" });
        }
        const updatedEmail = await EmailModel_1.default.findByIdAndUpdate(emailId, { status: false }, { new: true });
        if (!updatedEmail) {
            return res.status(404).json({ message: "Email not found" });
        }
        if (message.trim() && updatedEmail.email) {
            await (0, email_service_1.sendLoginResponse)({
                email: updatedEmail.email,
                description: message.trim(),
            });
        }
        res.status(200).json({
            message: "Email status set to false",
            email: updatedEmail,
        });
    }
    catch (error) {
        console.error("Error deactivating email:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deactivateEmail = deactivateEmail;
const getReportedUsers = async (req, res) => {
    try {
        const reportedUsers = await ReportedPhostModel_1.default.aggregate([
            {
                $match: {
                    reportType: "USER",
                    status: true
                }
            },
            {
                $lookup: {
                    from: "phosts",
                    localField: "phostId",
                    foreignField: "_id",
                    as: "phost"
                }
            },
            { $unwind: { path: "$phost", preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: "users",
                    localField: "phost.username",
                    foreignField: "name",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
            {
                $group: {
                    _id: "$user._id",
                    user: { $first: "$user" },
                    reportId: { $first: "$_id" }
                }
            },
            {
                $addFields: {
                    "user.reportId": "$reportId"
                }
            },
            {
                $replaceRoot: { newRoot: "$user" }
            }
        ]);
        return res.status(200).json({
            count: reportedUsers.length,
            users: reportedUsers
        });
    }
    catch (error) {
        console.error("Aggregation Error:", error);
        return res.status(500).json({
            message: "Failed to fetch reported users"
        });
    }
};
exports.getReportedUsers = getReportedUsers;
const rejectUserByName = async (req, res) => {
    try {
        const { name, reportId } = req.query;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Name is required and must be a string" });
        }
        const user = await CustomerModel_1.default.findOneAndUpdate({ name: name }, { $set: { status: "REJECTED" } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: `User with name "${name}" not found` });
        }
        if (!reportId) {
            return res.status(400).json({ message: "Report ID is required" });
        }
        const updatedReport = await ReportedPhostModel_1.default.findOneAndUpdate({ _id: reportId }, { $set: { status: false } }, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        await (0, email_service_1.sendRejectedAccount)({ email: user.email, description: `Your Account Has Been Restricted BY ADMIN \n Date: ${new Date().getDate()}` });
        return res.status(200).json({ message: `User "${name}" rejected successfully`, user });
    }
    catch (error) {
        console.error("Error rejecting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.rejectUserByName = rejectUserByName;
