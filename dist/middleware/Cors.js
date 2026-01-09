"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CorsPolicy = ((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://smart-blog-dev.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
exports.default = CorsPolicy;
