import express from "express";
import {getArchivedPhostsByUsername,getPhostById,deactivateReportedPhost, getReportByPhostId,setNotificationStatus,getUserReactions,searchPhosts,getReactionsStats,saveReaction,getAllPublishedPhosts,savePhost,getDraftPhosts, getDraftPhost,deletePhost,editPhost,getAllPendingPhosts,publishPhost,rejectPhost, getAllReportPhosts } from "../controllers/PhostsController";
import { downloadPostPDF } from "../controllers/PDFController";
import { reportPhost,getReportedPhostById } from "../controllers/ReportPhostController";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import AuthVerfication from "../middleware/Auth";

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


phostsRouter.post("/save-phost",AuthVerfication,savePhost);
phostsRouter.get("/draft-phost",AuthVerfication,getDraftPhosts);
phostsRouter.get("/get-draft-phost",AuthVerfication,getDraftPhost)
phostsRouter.get("/get-reported-phost",AuthVerfication,getReportByPhostId)
phostsRouter.get("/remove-report",AuthVerfication,deactivateReportedPhost)
phostsRouter.delete("/delete-phost",AuthVerfication,deletePhost)
phostsRouter.put("/edit-phost",AuthVerfication,editPhost)
phostsRouter.get("/get-all-pending",AuthVerfication,getAllPendingPhosts)
phostsRouter.get("/approve-phost",AuthVerfication,publishPhost)
phostsRouter.get("/get-phost",AuthVerfication,getPhostById)
phostsRouter.get("/reject-phost",AuthVerfication,rejectPhost)
phostsRouter.get("/get-all-report",AuthVerfication,getAllReportPhosts)
phostsRouter.get("/published-phost",AuthVerfication,getAllPublishedPhosts)
phostsRouter.get("/download-phost",AuthVerfication,downloadPostPDF)
phostsRouter.post("/report-phost",AuthVerfication,reportPhost)
phostsRouter.post("/save-reaction",AuthVerfication,saveReaction)
phostsRouter.post("/get-reaction",AuthVerfication,getReactionsStats)
phostsRouter.post("/find-phost",AuthVerfication,searchPhosts)
phostsRouter.get("/get-notification",AuthVerfication,getUserReactions)
phostsRouter.get("/set-notification",AuthVerfication,setNotificationStatus)
phostsRouter.get("/get-report-email",AuthVerfication,getReportedPhostById)
phostsRouter.get("/get-archived-phost",AuthVerfication,getArchivedPhostsByUsername)

export default phostsRouter;