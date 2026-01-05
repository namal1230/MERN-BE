"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchImages = void 0;
const axios_1 = __importDefault(require("axios"));
const unsplash = axios_1.default.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
});
const searchImages = async (query, page = 1) => {
    const res = await unsplash.get("/search/photos", {
        params: {
            query,
            page,
            per_page: 12,
        },
    });
    return res.data;
};
exports.searchImages = searchImages;
