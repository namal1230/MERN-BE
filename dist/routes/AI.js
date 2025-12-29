"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const AIRouter = (0, express_1.Router)();
AIRouter.post("/generate-image", AIController_1.generateImage);
exports.default = AIRouter;
