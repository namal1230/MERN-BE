"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageController_1 = require("../controllers/ImageController");
const unsplash = express_1.default.Router();
unsplash.get("/search", ImageController_1.getImages);
exports.default = unsplash;
