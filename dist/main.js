"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const Customer_1 = __importDefault(require("./routes/Customer"));
const Phosts_1 = __importDefault(require("./routes/Phosts"));
const EmailRouter_1 = __importDefault(require("./routes/EmailRouter"));
const Upload_1 = __importDefault(require("./routes/Upload"));
// import imageRoutes from "./routes/AI";
const Unspalsh_1 = __importDefault(require("./routes/Unspalsh"));
const Admin_1 = __importDefault(require("./routes/Admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log("MONGODB connected successfully");
}).catch((err) => {
    console.error("MongoDB Connection Failed", err);
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("tiny"));
app.use((0, cors_1.default)());
app.use("/api/upload", Upload_1.default);
app.use("/email", EmailRouter_1.default);
app.use("/customer", Customer_1.default);
app.use("/admin", Admin_1.default);
app.use("/phosts", Phosts_1.default);
// app.use("/api", imageRoutes);
app.use("/api/images", Unspalsh_1.default);
app.listen(PORT, () => {
    console.log(`Listening in port ${PORT}`);
});
