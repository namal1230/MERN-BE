"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PhostsController_1 = require("../controllers/PhostsController");
const phostsRouter = express_1.default.Router();
phostsRouter.post("/save-phost", PhostsController_1.savePhost);
phostsRouter.get("/draft-phost", PhostsController_1.getDraftPhosts);
phostsRouter.get("/get-draft-phost", PhostsController_1.getDraftPhost);
phostsRouter.delete("/delete-phost", PhostsController_1.deletePhost);
phostsRouter.put("/edit-phost", PhostsController_1.editPhost);
phostsRouter.get("/get-all-pending", PhostsController_1.getAllPendingPhosts);
phostsRouter.get("/approve-phost", PhostsController_1.publishPhost);
phostsRouter.get("/reject-phost", PhostsController_1.rejectPhost);
phostsRouter.get("/get-all-report", PhostsController_1.getAllReportPhosts);
exports.default = phostsRouter;
