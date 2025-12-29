import express from "express";
import { savePhost,getDraftPhosts, getDraftPhost,deletePhost,editPhost } from "../controllers/PhostsController";

const phostsRouter = express.Router();

phostsRouter.post("/save-phost",savePhost);
phostsRouter.get("/draft-phost",getDraftPhosts);
phostsRouter.get("/get-draft-phost",getDraftPhost)
phostsRouter.delete("/delete-phost",deletePhost)
phostsRouter.put("/edit-phost",editPhost)

export default phostsRouter;