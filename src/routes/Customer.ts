import express from "express";
import { getFollowingPhosts,followUser,getFollowersCountByName,getCustomer,loginCustomer,saveUserInfo,getUserInfoByEmail,getUserInfoByName } from "../controllers/CustomerController";
import fs from "fs";
import path from "path";
import morgan from "morgan";

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

customerRouter.get("/get-customer",getCustomer);
customerRouter.post("/login-customer",loginCustomer);
customerRouter.post("/save-info",saveUserInfo);
customerRouter.get("/get-info",getUserInfoByEmail);
customerRouter.get("/get-name-info",getUserInfoByName);
customerRouter.get("/follow-user",followUser);
customerRouter.get("/follow-user-count",getFollowersCountByName);
customerRouter.get("/get-following-phosts",getFollowingPhosts);

export default customerRouter;
