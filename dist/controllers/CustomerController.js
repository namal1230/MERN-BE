"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.getFollowingPhosts = exports.getFollowersCountByName = exports.followUser = exports.getUserInfoByName = exports.getUserInfoByEmail = exports.saveUserInfo = exports.loginCustomer = exports.getCustomer = void 0;
const GenerateToken_1 = require("../utils/GenerateToken");
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const UserInfo_1 = __importDefault(require("../models/UserInfo"));
const FollowSchema_1 = __importDefault(require("../models/FollowSchema"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
const VerifyRefreshToken_1 = require("../utils/VerifyRefreshToken");
const getCustomer = (req, res) => {
    res.status(200).json("Get Request Customer");
};
exports.getCustomer = getCustomer;
const loginCustomer = async (req, res) => {
    console.log("trigger");
    try {
        const user = req.body;
        if (!user?.id || !user?.email) {
            return res.status(400).json({ message: "Invalid user data" });
        }
        const existingUser = await CustomerModel_1.default.findOne({ firebaseUid: user.id });
        const role = existingUser?.role || "user";
        const status = existingUser?.status || "VALID";
        if (existingUser?.status !== "VALID") {
            return res.status(403).json({ message: "Your Account Has Restricted." });
        }
        const token = (0, GenerateToken_1.generateToken)({
            id: user.id,
            name: user.name,
            email: user.email,
            role,
            status,
        });
        const refresh = (0, GenerateToken_1.refreshToken)({
            id: user.id,
            name: user.name,
            email: user.email,
            role,
            status,
        });
        const updatedUser = await CustomerModel_1.default.findOneAndUpdate({ $or: [{ firebaseUid: user.id }, { email: user.email }] }, {
            $set: {
                firebaseUid: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile || `default-${Date.now()}`,
                refreshToken: refresh,
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        await UserInfo_1.default.findOneAndUpdate({ email: user.email }, {
            $setOnInsert: {
                name: user.name,
                email: user.email,
                profileUrl: user.profile || "",
                role,
            },
        }, {
            upsert: true,
            new: true,
        });
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({
            message: "Customer login success",
            token,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profile: updatedUser.profile,
                role: updatedUser.role,
                status: updatedUser.status,
            },
        });
    }
    catch (err) {
        console.error("Login failed:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
exports.loginCustomer = loginCustomer;
const saveUserInfo = async (req, res) => {
    try {
        const { name, email, bio, jobTitle, experienceYears, portfolioUrl, githubUrl, linkdinUrl, anotherUrl, skills, profileUrl, } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required",
            });
        }
        const updatedUser = await UserInfo_1.default.findOneAndUpdate({ email }, {
            $set: {
                name,
                email,
                bio: bio ?? "",
                jobTitle: jobTitle ?? "",
                experienceYears: experienceYears ?? "",
                portfolioUrl: portfolioUrl ?? "",
                githubUrl: githubUrl ?? "",
                linkdinUrl: linkdinUrl ?? "",
                anotherUrl: anotherUrl ?? "",
                skills: Array.isArray(skills) ? skills : [],
                profileUrl: profileUrl ?? "",
            },
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return res.status(200).json({
            message: "User info saved successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("SaveUserInfo Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.saveUserInfo = saveUserInfo;
const getUserInfoByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserInfo_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getUserInfoByEmail = getUserInfoByEmail;
const getUserInfoByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Name is required" });
        }
        const user = await UserInfo_1.default.findOne({ name: name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getUserInfoByName = getUserInfoByName;
const followUser = async (req, res) => {
    try {
        const { name, currentUser } = req.query;
        if (!name || !currentUser) {
            return res.status(400).json({ message: "Fields are required" });
        }
        const targetUser = await CustomerModel_1.default.findOne({ name });
        if (!targetUser) {
            return res.status(404).json({ message: "Target user not found" });
        }
        if (currentUser === targetUser.firebaseUid) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }
        const follow = await FollowSchema_1.default.create({
            currentUser,
            user: targetUser._id,
        });
        return res.status(201).json({ message: "User followed successfully", follow });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.followUser = followUser;
const getFollowersCountByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const targetUser = await CustomerModel_1.default.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const followersCount = await FollowSchema_1.default.countDocuments({ user: targetUser._id });
        return res.status(200).json({ name: targetUser.name, followers: followersCount });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFollowersCountByName = getFollowersCountByName;
const getFollowingPhosts = async (req, res) => {
    try {
        const { currentUser } = req.query;
        if (!currentUser) {
            return res.status(400).json({ message: "currentUser is required" });
        }
        const follows = await FollowSchema_1.default.find({ currentUser })
            .select("user")
            .lean();
        if (!follows.length) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }
        const followedUserIds = follows.map(f => f.user);
        const users = await CustomerModel_1.default.find({
            _id: { $in: followedUserIds },
            status: "VALID",
        })
            .select("name")
            .lean();
        if (!users.length) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }
        const usernames = users.map(u => u.name);
        const phosts = await PhostsModel_1.default.aggregate([
            {
                $match: {
                    status: "published",
                    username: { $in: usernames },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "phostreactions",
                    localField: "_id",
                    foreignField: "phostId",
                    as: "reactions",
                },
            },
            {
                $addFields: {
                    likeCount: {
                        $size: {
                            $filter: {
                                input: "$reactions",
                                as: "r",
                                cond: { $eq: ["$$r.liked", true] },
                            },
                        },
                    },
                    commentCount: {
                        $size: {
                            $filter: {
                                input: "$reactions",
                                as: "r",
                                cond: {
                                    $and: [
                                        { $ne: ["$$r.comment", ""] },
                                        { $ne: ["$$r.comment", null] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdAt: 1,
                    username: 1,
                    likeCount: 1,
                    commentCount: 1,
                },
            },
        ]);
        const data = phosts.map(p => {
            const firstImage = p.body.find((b) => b.type === "IMG" || b.type === "UNSPLASH");
            return {
                _id: p._id.toString(),
                title: p.title,
                createdAt: p.createdAt.toISOString(),
                username: p.username,
                image: firstImage ? firstImage.value : null,
                likeCount: p.likeCount,
                commentCount: p.commentCount,
            };
        });
        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    }
    catch (error) {
        console.error("Get following phosts error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch following phosts",
        });
    }
};
exports.getFollowingPhosts = getFollowingPhosts;
const refreshAccessToken = async (req, res) => {
    try {
        const refreshTokenFromCookie = req.cookies?.refresh;
        if (!refreshTokenFromCookie) {
            return res.status(401).json({ message: "No refresh token" });
        }
        const decoded = (0, VerifyRefreshToken_1.verifyRefreshToken)(refreshTokenFromCookie);
        if (!decoded) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const user = await CustomerModel_1.default.findOne({ refreshToken: refreshTokenFromCookie });
        if (!user) {
            return res.status(403).json({ message: "Refresh token not found" });
        }
        const newAccessToken = (0, GenerateToken_1.generateToken)({
            id: user.firebaseUid,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Refresh failed" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
