import express from "express";
import { getAllPublishedPhosts,savePhost,getDraftPhosts, getDraftPhost,deletePhost,editPhost,getAllPendingPhosts,publishPhost,rejectPhost, getAllReportPhosts } from "../controllers/PhostsController";
import { downloadPostPDF } from "../controllers/PDFController";
const phostsRouter = express.Router();

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

export default phostsRouter;