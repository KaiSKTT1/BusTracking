import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// routers (đường dẫn mới)
import authRouter from "./routes/authRoute.js";

import userRouter from "./routes/admin/userRoute.js";
import busRouter from "./routes/admin/busRoute.js";
import routeRouter from "./routes/admin/routeRoute.js";
import tripRouter from "./routes/admin/tripRoute.js";
import timetableRouter from "./routes/admin/timetableRoute.js";
import baocaoRouter from "./routes/admin/baocaoRoute.js";
import chitietBaoCaoRouter from "./routes/admin/chitietBaoCaoRoute.js";

import driversRouter from "./routes/drivers/driversRoute.js";

import studentRouter from "./routes/parent/studentRoute.js";
import guardiansRouter from "./routes/parent/guardiansRoute.js";
import studentRideRouter from "./routes/parent/studentRideRoute.js";
import stopRouter from "./routes/parent/stopRoute.js";
import schoolRouter from "./routes/admin/schoolRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount routes (giữ các endpoint cũ để frontend không đổi)
app.use("/auth", authRouter);

app.use(["/users", "/user_account"], userRouter);
app.use(["/buses", "/bus"], busRouter);
app.use(["/routes", "/route"], routeRouter);
app.use(["/trips", "/trip"], tripRouter);
app.use("/timetable", timetableRouter);
app.use("/baocao", baocaoRouter);
app.use("/chitietbaocao", chitietBaoCaoRouter);

app.use(["/drivers", "/driver"], driversRouter);

app.use(["/students", "/student"], studentRouter);
app.use(["/guardians", "/guardian"], guardiansRouter);
app.use(["/student_rides", "/student_ride"], studentRideRouter);
app.use(["/stops", "/stop"], stopRouter);
app.use('/schools', schoolRouter);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
