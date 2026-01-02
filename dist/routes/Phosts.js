"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PhostsController_1 = require("../controllers/PhostsController");
const PDFController_1 = require("../controllers/PDFController");
const ReportPhostController_1 = require("../controllers/ReportPhostController");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const phostsRouter = express_1.default.Router();
const LOG_DIR = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR);
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(LOG_DIR, "phosts.log"), { flags: "a" });
phostsRouter.use((0, morgan_1.default)("tiny", { stream: accessLogStream }));
phostsRouter.post("/save-phost", PhostsController_1.savePhost);
phostsRouter.get("/draft-phost", PhostsController_1.getDraftPhosts);
phostsRouter.get("/get-draft-phost", PhostsController_1.getDraftPhost);
phostsRouter.delete("/delete-phost", PhostsController_1.deletePhost);
phostsRouter.put("/edit-phost", PhostsController_1.editPhost);
phostsRouter.get("/get-all-pending", PhostsController_1.getAllPendingPhosts);
phostsRouter.get("/approve-phost", PhostsController_1.publishPhost);
phostsRouter.get("/reject-phost", PhostsController_1.rejectPhost);
phostsRouter.get("/get-all-report", PhostsController_1.getAllReportPhosts);
phostsRouter.get("/published-phost", PhostsController_1.getAllPublishedPhosts);
phostsRouter.get("/download-phost", PDFController_1.downloadPostPDF);
phostsRouter.post("/report-phost", ReportPhostController_1.reportPhost);
phostsRouter.post("/save-reaction", PhostsController_1.saveReaction);
phostsRouter.post("/get-reaction", PhostsController_1.getReactionsStats);
phostsRouter.post("/find-phost", PhostsController_1.searchPhosts);
phostsRouter.get("/get-notification", PhostsController_1.getUserReactions);
phostsRouter.get("/set-notification", PhostsController_1.setNotificationStatus);
exports.default = phostsRouter;
