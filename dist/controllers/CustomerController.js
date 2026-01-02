"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowersCountByName = exports.followUser = exports.getUserInfoByName = exports.getUserInfoByEmail = exports.saveUserInfo = exports.loginCustomer = exports.getCustomer = void 0;
const GenerateToken_1 = require("../utils/GenerateToken");
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const UserInfo_1 = __importDefault(require("../models/UserInfo"));
const FollowSchema_1 = __importDefault(require("../models/FollowSchema"));
const getCustomer = (req, res) => {
    res.status(200).json("Get Request Customer");
};
exports.getCustomer = getCustomer;
const loginCustomer = async (req, res) => {
    try {
        const user = req.body;
        if (!user?.id || !user?.email) {
            return res.status(400).json({ message: "Invalid user data" });
        }
        const token = (0, GenerateToken_1.generateToken)(user);
        const refresh = (0, GenerateToken_1.refreshToken)(user);
        const updatedUser = await CustomerModel_1.default.findOneAndUpdate({ firebaseUid: user.id }, {
            $set: {
                firebaseUid: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile,
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
            user: updatedUser,
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
