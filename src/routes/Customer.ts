import express from "express";
import { getCustomer,loginCustomer } from "../controllers/CustomerController";

const customerRouter = express.Router();

customerRouter.get("/get-customer",getCustomer);
customerRouter.post("/login-customer",loginCustomer);

export default customerRouter;
