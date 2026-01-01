"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReactions = exports.searchPhosts = exports.getReactionsStats = exports.saveReaction = exports.getAllPublishedPhosts = exports.getAllReportPhosts = exports.rejectPhost = exports.publishPhost = exports.getAllPendingPhosts = exports.editPhost = exports.deletePhost = exports.getDraftPhost = exports.getDraftPhosts = exports.savePhost = void 0;
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const email_service_1 = require("../services/email.service");
const ReactionModel_1 = __importDefault(require("../models/ReactionModel"));
const savePhost = async (req, res) => {
    try {
        console.log(req.body);
        const { title, body, code, name, email } = req.body;
        if (!title || !Array.isArray(body) || !name || !email) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }
        const cleanedBody = body.filter((block) => block.value && block.value.trim() !== "");
        const newPhost = await PhostsModel_1.default.create({
            title,
            body: cleanedBody,
            code,
            username: name,
            email
        });
        if (typeof title !== "string")
            return;
        const status = "phost-upload";
        await (0, email_service_1.sendLoginEmails)({ email, description: title, status });
        res.status(200).json({ message: "Phosts saved Successfully", data: newPhost });
    }
    catch (err) {
        console.error("Phosts saved failed:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
exports.savePhost = savePhost;
const getDraftPhosts = async (req, res) => {
    console.log("request catched");
    try {
        const { name, email, status } = req.query;
        console.log("request catched", name, email);
        if (!name || !email || !status) {
            return res.status(400).json({
                message: "username and email and status are required"
            });
        }
        const drafts = await PhostsModel_1.default.aggregate([
            {
                $match: {
                    username: name,
                    email,
                    status
                }
            },
            {
                $addFields: {
                    firstImage: {
                        $first: {
                            $filter: {
                                input: "$body",
                                as: "block",
                                cond: {
                                    $in: ["$$block.type", ["IMG", "UNSPLASH"]]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    createdAt: 1,
                    image: "$firstImage.value"
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(200).json(drafts);
    }
    catch (error) {
        console.error("Failed to fetch draft phosts:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.getDraftPhosts = getDraftPhosts;
const getDraftPhost = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "phost id is required"
            });
        }
        // validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "invalid phost id"
            });
        }
        const phost = await PhostsModel_1.default.findOne({
            _id: id
        });
        if (!phost) {
            return res.status(404).json({
                message: "phost not found"
            });
        }
        res.status(200).json(phost);
    }
    catch (error) {
        console.error("Failed to fetch draft phost:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.getDraftPhost = getDraftPhost;
const deletePhost = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "phost id is required"
            });
        }
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "invalid phost id"
            });
        }
        const deletedPhost = await PhostsModel_1.default.findOneAndDelete({
            _id: id,
            status: "pending" // only allow deleting drafts
        });
        if (!deletedPhost) {
            return res.status(404).json({
                message: "phost not found or already deleted"
            });
        }
        res.status(200).json({
            message: "phost deleted successfully",
            phostId: deletedPhost._id
        });
    }
    catch (error) {
        console.error("Failed to delete phost:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.deletePhost = deletePhost;
const editPhost = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, body, code, name, email } = req.body;
        // 1️⃣ Validate id
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "phost id is required"
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "invalid phost id"
            });
        }
        // 2️⃣ Basic validation
        if (!title || !Array.isArray(body)) {
            return res.status(400).json({
                message: "title and body are required"
            });
        }
        // 3️⃣ Update draft phost
        const updatedPhost = await PhostsModel_1.default.findOneAndUpdate({
            _id: id,
            status: "pending" // only editable drafts
        }, {
            $set: {
                title,
                body,
                code,
                username: name,
                email
            }
        }, {
            new: true, // return updated document
            runValidators: true // schema validation
        });
        if (!updatedPhost) {
            return res.status(404).json({
                message: "phost not found or not editable"
            });
        }
        res.status(200).json({
            message: "phost updated successfully",
            phost: updatedPhost
        });
    }
    catch (error) {
        console.error("Failed to edit phost:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.editPhost = editPhost;
const getAllPendingPhosts = async (req, res) => {
    try {
        const phosts = await PhostsModel_1.default.find({ status: "pending" })
            .sort({ createdAt: -1 }); // newest first
        res.status(200).json({
            success: true,
            count: phosts.length,
            data: phosts
        });
    }
    catch (error) {
        console.error("Error fetching pending phosts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending phosts"
        });
    }
};
exports.getAllPendingPhosts = getAllPendingPhosts;
const publishPhost = async (req, res) => {
    const { id } = req.query;
    // 1️⃣ Validate presence & type
    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Valid phost id is required" });
    }
    // 2️⃣ Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid phost id" });
    }
    try {
        // 3️⃣ Update status
        const phost = await PhostsModel_1.default.findByIdAndUpdate(id, { status: "published" }, { new: true });
        if (!phost) {
            return res.status(404).json({ message: "Phost not found" });
        }
        const status = "phost-published";
        const email = phost.email;
        const description = phost.title;
        if (email && description) {
            await (0, email_service_1.sendLoginEmails)({ email, description, status });
        }
        console.log(phost.email, phost.title);
        res.status(200).json({
            success: true,
            message: "Phost published successfully",
            data: phost
        });
    }
    catch (error) {
        console.error("Publish error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to publish phost"
        });
    }
};
exports.publishPhost = publishPhost;
const rejectPhost = async (req, res) => {
    const { id } = req.query;
    // 1️⃣ Validate presence & type
    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Valid phost id is required" });
    }
    // 2️⃣ Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid phost id" });
    }
    try {
        // 3️⃣ Update status
        const phost = await PhostsModel_1.default.findByIdAndUpdate(id, { status: "archived" }, { new: true });
        if (!phost) {
            return res.status(404).json({ message: "Phost not found" });
        }
        const status = "phost-rejected";
        const email = phost.email;
        const description = phost.title;
        if (email && description) {
            await (0, email_service_1.sendLoginEmails)({ email, description, status });
        }
        res.status(200).json({
            success: true,
            message: "Phost rejected successfully",
            data: phost
        });
    }
    catch (error) {
        console.error("Publish error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to publish phost"
        });
    }
};
exports.rejectPhost = rejectPhost;
const getAllReportPhosts = async (req, res) => {
    try {
        const phosts = await PhostsModel_1.default.find({ status: "archived" })
            .sort({ createdAt: -1 }); // newest first
        res.status(200).json({
            success: true,
            count: phosts.length,
            data: phosts
        });
    }
    catch (error) {
        console.error("Error fetching reported phosts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reported phosts"
        });
    }
};
exports.getAllReportPhosts = getAllReportPhosts;
const getAllPublishedPhosts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const lastId = req.query.lastId;
        const userEmail = req.query.userEmail;
        const matchStage = {
            status: "published",
        };
        if (userEmail) {
            matchStage.email = { $ne: userEmail };
        }
        if (lastId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(lastId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid lastId",
                });
            }
            matchStage._id = { $lt: new mongoose_1.default.Types.ObjectId(lastId) };
        }
        const phosts = await PhostsModel_1.default.aggregate([
            { $match: matchStage },
            { $sort: { _id: -1 } },
            { $limit: limit },
            // 🔹 Lookup reactions
            {
                $lookup: {
                    from: "phostreactions", // collection name (lowercase, plural)
                    localField: "_id",
                    foreignField: "phostId",
                    as: "reactions",
                },
            },
            // 🔹 Calculate counts
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
            // 🔹 Return only needed fields
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
        const data = phosts.map((p) => {
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
        const lastPhost = phosts.at(-1);
        res.status(200).json({
            success: true,
            count: data.length,
            nextCursor: lastPhost ? lastPhost._id.toString() : null,
            data,
        });
    }
    catch (error) {
        console.error("Error fetching published phosts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch published phosts",
        });
    }
};
exports.getAllPublishedPhosts = getAllPublishedPhosts;
const saveReaction = async (req, res) => {
    try {
        const phostId = req.query.id;
        const { like, comment, username, profile } = req.body;
        if (!phostId || !mongoose_1.default.Types.ObjectId.isValid(phostId)) {
            return res.status(400).json({ message: "Invalid or missing phost ID" });
        }
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (typeof like !== "boolean") {
            return res.status(400).json({ message: "'like' must be a boolean" });
        }
        const hasComment = comment && comment.trim().length > 0;
        if (like === true && !hasComment) {
            const alreadyLiked = await ReactionModel_1.default.findOne({
                phostId,
                username,
                liked: true,
            });
            if (alreadyLiked) {
                return res.status(409).json({
                    message: "User has already liked this post",
                });
            }
        }
        const reaction = await ReactionModel_1.default.create({
            phostId,
            liked: like,
            comment: hasComment ? comment : "",
            username,
            profilePicture: profile,
        });
        return res.status(200).json({ success: true, reaction });
    }
    catch (error) {
        console.error("Error saving reaction:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.saveReaction = saveReaction;
const getReactionsStats = async (req, res) => {
    try {
        const phostId = req.query.id;
        const userName = req.query.name;
        if (!phostId || !mongoose_1.default.Types.ObjectId.isValid(phostId)) {
            return res.status(400).json({ message: "Invalid or missing phost ID" });
        }
        const reactions = await ReactionModel_1.default.aggregate([
            {
                $facet: {
                    withComments: [
                        {
                            $match: {
                                phostId: new mongoose_1.default.Types.ObjectId(phostId),
                                comment: { $ne: "" }
                            }
                        },
                        { $sort: { createdAt: -1 } }
                    ],
                    likedCount: [
                        {
                            $match: {
                                phostId: new mongoose_1.default.Types.ObjectId(phostId),
                                liked: true
                            }
                        },
                        { $count: "totalLikes" }
                    ],
                    userLiked: [
                        {
                            $match: {
                                phostId: new mongoose_1.default.Types.ObjectId(phostId),
                                liked: true,
                                username: userName
                            }
                        },
                        { $limit: 1 }
                    ]
                }
            }
        ]);
        const totalLikes = reactions[0].likedCount[0]?.totalLikes || 0;
        const isLikedByUser = reactions[0].userLiked.length > 0;
        res.json({
            comments: reactions[0].withComments,
            totalLikes,
            isLikedByUser
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getReactionsStats = getReactionsStats;
const searchPhosts = async (req, res) => {
    try {
        const searchText = req.query.search;
        const excludeEmail = req.query.excludeEmail;
        const query = {};
        if (searchText) {
            query.$or = [
                { title: { $regex: searchText, $options: "i" } },
                { "body.value": { $regex: searchText, $options: "i" } },
            ];
        }
        if (excludeEmail) {
            query.email = { $ne: excludeEmail };
        }
        const phosts = await PhostsModel_1.default.find(query).sort({ createdAt: -1 });
        // Map posts and count reactions
        const mapped = await Promise.all(phosts.map(async (p) => {
            const firstImage = p.body.find((b) => b.type === "IMG");
            // Count likes and comments
            const likeCount = await ReactionModel_1.default.countDocuments({
                phostId: p._id,
                liked: true,
            });
            const commentCount = await ReactionModel_1.default.countDocuments({
                phostId: p._id,
                comment: { $exists: true, $ne: "" },
            });
            return {
                _id: p._id.toString(),
                title: p.title,
                createdAt: p.createdAt.toISOString(),
                username: p.username,
                image: firstImage ? firstImage.value : null,
                likeCount,
                commentCount,
            };
        }));
        res.status(200).json(mapped);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.searchPhosts = searchPhosts;
const getUserReactions = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username || typeof username !== "string") {
            return res.status(400).json({ message: "Username is required" });
        }
        const userPhosts = await PhostsModel_1.default.find({ username }).select("_id title");
        if (!userPhosts.length) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        const phostIds = userPhosts.map((p) => p._id);
        const reactions = await ReactionModel_1.default.find({ phostId: { $in: phostIds } });
        const result = userPhosts.map((post) => {
            const postReactions = reactions.filter((r) => r.phostId.toString() === post._id.toString());
            const totalLikes = postReactions.filter((r) => r.liked).length;
            const totalComments = postReactions.filter((r) => r.comment).length;
            return {
                phostId: post._id,
                title: post.title,
                totalReactions: postReactions.length,
                totalLikes,
                totalComments,
                reactions: postReactions.map((r) => ({
                    username: r.username,
                    profilePicture: r.profilePicture,
                    liked: r.liked,
                    comment: r.comment,
                    createdAt: r.createdAt,
                })),
            };
        });
        return res.status(200).json({ data: result });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err });
    }
};
exports.getUserReactions = getUserReactions;
