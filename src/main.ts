import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import customerRouter from "./routes/Customer";
import phostsRouter from "./routes/Phosts";
import emailRouter from "./routes/EmailRouter";
import uploadRouter from "./routes/Upload";
import imageRoutes from "./routes/Unspalsh";
import adminRouter from "./routes/Admin";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "";



mongoose.connect(MONGO_URI).then(()=>{
    console.log("MONGODB connected successfully")
}).catch((err)=>{
    console.error("MongoDB Connection Failed", err)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors({
    origin:"https://smart-blog-eosin.vercel.app/",
    credentials:true,
}));

app.use("/api/upload",uploadRouter);
app.use("/email", emailRouter);
app.use("/customer",customerRouter);
app.use("/admin",adminRouter);
app.use("/phosts",phostsRouter);
app.use("/api/images", imageRoutes);

app.listen(PORT,()=>{
    console.log(`Listening in port ${PORT}`)
})