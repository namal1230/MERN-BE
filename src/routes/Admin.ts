import express from "express";
import { getReportedUsers,getDashboardStats,deactivateEmail,rejectUserByName } from "../controllers/AdminDashboard";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import AuthVerfication from "../middleware/Auth";

const adminRouter = express.Router();

adminRouter.get("/get-stats",AuthVerfication,getDashboardStats);
adminRouter.get("/resole-login",AuthVerfication,deactivateEmail);
adminRouter.get("/get-reported-users",AuthVerfication,getReportedUsers);
adminRouter.get("/rejected-user",AuthVerfication,rejectUserByName);

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