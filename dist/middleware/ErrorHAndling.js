"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandling = ((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});
exports.default = ErrorHandling;
