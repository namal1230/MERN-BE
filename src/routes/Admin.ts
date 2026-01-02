import express from "express";
import { getDashboardStats } from "../controllers/AdminDashboard";
import fs from "fs";
import path from "path";
import morgan from "morgan";

const adminRouter = express.Router();

adminRouter.get("/get-stats",getDashboardStats);

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "admin.log"),
  { flags: "a" }
);

adminRouter.use(morgan("tiny", { stream: accessLogStream }));

export default adminRouter;