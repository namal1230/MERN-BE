import express from "express";
import { getCurrentUser,refreshAccessToken,getFollowingPhosts,followUser,getFollowersCountByName,getCustomer,loginCustomer,saveUserInfo,getUserInfoByEmail,getUserInfoByName } from "../controllers/CustomerController";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import AuthVerfication from "../middleware/Auth";

const customerRouter = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");


if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const accessLogStream = fs.createWriteStream(
  path.join(LOG_DIR, "customer.log"),
  { flags: "a" }
);

customerRouter.use(morgan("tiny", { stream: accessLogStream }));

customerRouter.get("/get-customer",AuthVerfication,getCustomer);
customerRouter.post("/login-customer",loginCustomer);
customerRouter.get("/refresh-token",refreshAccessToken);
customerRouter.post("/save-info",AuthVerfication,saveUserInfo);
customerRouter.get("/get-info",AuthVerfication,getUserInfoByEmail);
customerRouter.get("/get-name-info",AuthVerfication,getUserInfoByName);
customerRouter.get("/follow-user",AuthVerfication,followUser);
customerRouter.get("/follow-user-count",AuthVerfication,getFollowersCountByName);
customerRouter.get("/get-following-phosts",AuthVerfication,getFollowingPhosts);
customerRouter.get("/verify-refresh-token",getCurrentUser);

export default customerRouter;
