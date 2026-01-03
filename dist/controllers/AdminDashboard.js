"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateEmail = exports.getDashboardStats = void 0;
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
const EmailModel_1 = __importDefault(require("../models/EmailModel"));
const email_service_1 = require("../services/email.service");
const getDashboardStats = async (req, res) => {
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
