import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import customerRouter from "./routes/Customer";
import phostsRouter from "./routes/Phosts";
import emailRouter from "./routes/EmailRouter";
import { error } from "node:console";
import uploadRouter from "./routes/Upload";
import multer from "multer";
// import imageRoutes from "./routes/AI";
import imageRoutes from "./routes/Unspalsh";
import adminRouter from "./routes/Admin";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI).then(()=>{
    console.log("MONGODB connected successfully")
}).catch((err)=>{
    console.error("MongoDB Connection Failed", err)
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan("tiny"));
app.use(cors());
app.use("/api/upload",uploadRouter);
app.use("/email", emailRouter);
app.use("/customer",customerRouter);
app.use("/admin",adminRouter);
app.use("/phosts",phostsRouter);
// app.use("/api", imageRoutes);
app.use("/api/images", imageRoutes);

app.listen(PORT,()=>{
    console.log(`Listening in port ${PORT}`)
})