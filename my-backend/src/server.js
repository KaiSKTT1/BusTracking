import './configs/env.js';
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import busRouter from "./routes/busRoute.js";
import studentRouter from "./routes/studentRoute.js";
import guardiansRouter from "./routes/guardiansRoute.js";
import driversRouter from "./routes/driversRoute.js";
import authRouter from "./routes/authRoute.js";

// cài thư viện
//npm install jsonwebtoken
//npm install cookie-parser
//npm install bcryptjs



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173", // hoặc 3000 nếu dùng CRA
    credentials: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/buses", busRouter);
app.use("/students", studentRouter);
app.use("/guardians", guardiansRouter);
app.use("/drivers", driversRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("🚀 API is running!");
});
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
