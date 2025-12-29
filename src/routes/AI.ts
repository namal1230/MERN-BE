import { Router } from "express";
import { generateImage } from "../controllers/AIController";

const AIRouter = Router();

AIRouter.post("/generate-image", generateImage);

export default AIRouter;
