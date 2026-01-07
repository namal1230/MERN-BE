import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import customerRouter from "./routes/Customer";
import phostsRouter from "./routes/Phosts";
import emailRouter from "./routes/EmailRouter";
import uploadRouter from "./routes/Upload";
import imageRoutes from "./routes/Unspalsh";
import adminRouter from "./routes/Admin";
import ErrorHandling from "./middleware/ErrorHAndling";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

/* =======================
   CORS CONFIG (CRITICAL)
======================= */

const allowedOrigins = [
  "https://smart-blog-dev.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 REQUIRED for preflight
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES HERE

app.use(ErrorHandling);


/* =======================
   DB
======================= */

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection failed", err));

/* =======================
   ROUTES
======================= */

app.get("/ping", (req, res) => res.json({ status: "ok" }));

app.use("/api/upload", uploadRouter);
app.use("/email", emailRouter);
app.use("/customer", customerRouter);
app.use("/admin", adminRouter);
app.use("/phosts", phostsRouter);
app.use("/api/images", imageRoutes);

/* =======================
   ERROR HANDLER
======================= */

app.use(ErrorHandling);

/* =======================
   START
======================= */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
