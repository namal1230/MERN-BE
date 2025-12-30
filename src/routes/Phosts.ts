import express from "express";
import { savePhost,getDraftPhosts, getDraftPhost,deletePhost,editPhost,getAllPendingPhosts,publishPhost,rejectPhost, getAllReportPhosts } from "../controllers/PhostsController";

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

export default phostsRouter;