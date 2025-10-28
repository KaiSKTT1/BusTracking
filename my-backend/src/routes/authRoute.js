// src/routes/auth.routes.js
import express from "express";
import cookieParser from "cookie-parser";
import AuthController from "../controllers/authController.js";

const router = express.Router();
router.use(cookieParser());

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
