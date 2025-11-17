import express from "express";
// Xóa: import pool from "../configs/connectDB.js";
import authController from "../controllers/authController.js"; // Thêm dòng này

const router = express.Router();

// POST /auth/login
// Sửa: Trỏ route vào controller
router.post("/login", authController.login);

export default router;