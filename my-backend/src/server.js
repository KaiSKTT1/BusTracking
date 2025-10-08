import express from "express";
import bodyParser from "body-parser";

import userRouter from "./routes/userRoute.js";
import busRouter from "./routes/busRoute.js";
import studentRouter from "./routes/studentRoute.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/users", userRouter);
app.use("/buses", busRouter);
app.use("/students", studentRouter);

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
