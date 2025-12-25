"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vedioUpload = exports.imageUpload = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const imageUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file provided" });
        }
        const result = await cloudinary_1.default.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
            folder: "blog-images",
            resource_type: "image",
        });
        return res.json({
            url: result.secure_url
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
    }
};
exports.imageUpload = imageUpload;
const vedioUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file provided" });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({
                resource_type: "video",
                folder: "blog-videos",
                chunk_size: 6_000_000, // 6MB chunks (recommended)
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(file.buffer);
        });
        return res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
            duration: result.duration,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Video upload failed" });
    }
};
exports.vedioUpload = vedioUpload;
