import express from "express";
import { setNotificationStatus,getUserReactions,searchPhosts,getReactionsStats,saveReaction,getAllPublishedPhosts,savePhost,getDraftPhosts, getDraftPhost,deletePhost,editPhost,getAllPendingPhosts,publishPhost,rejectPhost, getAllReportPhosts } from "../controllers/PhostsController";
import { downloadPostPDF } from "../controllers/PDFController";
import { reportPhost } from "../controllers/ReportPhostController";
import fs from "fs";
import path from "path";
import morgan from "morgan";

const phostsRouter = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "phosts.log"),
  { flags: "a" }
);

phostsRouter.use(morgan("tiny", { stream: accessLogStream }));


phostsRouter.post("/save-phost",savePhost);
phostsRouter.get("/draft-phost",getDraftPhosts);
phostsRouter.get("/get-draft-phost",getDraftPhost)
phostsRouter.delete("/delete-phost",deletePhost)
phostsRouter.put("/edit-phost",editPhost)
phostsRouter.get("/get-all-pending",getAllPendingPhosts)
phostsRouter.get("/approve-phost",publishPhost)
phostsRouter.get("/reject-phost",rejectPhost)
phostsRouter.get("/get-all-report",getAllReportPhosts)
phostsRouter.get("/published-phost",getAllPublishedPhosts)
phostsRouter.get("/download-phost",downloadPostPDF)
phostsRouter.post("/report-phost",reportPhost)
phostsRouter.post("/save-reaction",saveReaction)
phostsRouter.post("/get-reaction",getReactionsStats)
phostsRouter.post("/find-phost",searchPhosts)
phostsRouter.get("/get-notification",getUserReactions)
phostsRouter.get("/set-notification",setNotificationStatus)

export default phostsRouter;