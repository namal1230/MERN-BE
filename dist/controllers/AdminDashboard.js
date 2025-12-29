"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
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
