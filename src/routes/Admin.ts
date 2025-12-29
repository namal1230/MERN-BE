import express from "express";
import { getDashboardStats } from "../controllers/AdminDashboard";
const adminRouter = express.Router();

adminRouter.get("/get-stats",getDashboardStats);

export default adminRouter;