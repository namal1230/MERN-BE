"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImages = void 0;
const unsplash_service_1 = require("../services/unsplash.service");
/**
 * GET /api/images?q=car&page=1
 */
const getImages = async (req, res) => {
    try {
        const { q, page } = req.query;
        if (!q || typeof q !== "string") {
            res.status(400).json({ message: "Query required" });
            return;
        }
        const pageNumber = typeof page === "string" ? parseInt(page, 10) : 1;
        const data = await (0, unsplash_service_1.searchImages)(q, pageNumber);
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Unsplash fetch error:", error);
        res.status(500).json({ message: "Failed to fetch images" });
    }
};
exports.getImages = getImages;
