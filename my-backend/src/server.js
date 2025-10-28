import express from "express";
import bodyParser from "body-parser";

import userRouter from "./routes/userRoute.js";
import busRouter from "./routes/busRoute.js";
import studentRouter from "./routes/studentRoute.js";
import guardiansRouter from "./routes/guardiansRoute.js";
import driversRouter from "./routes/driversRoute.js";

import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/users", userRouter);
app.use("/buses", busRouter);
app.use("/students", studentRouter);
app.use("/guardians", guardiansRouter);
app.use("/drivers", driversRouter);

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
