// src/config/env.js
import dotenv from "dotenv";
import path from "path";

// Luôn load biến môi trường TRƯỚC khi các file khác chạy
dotenv.config({ path: path.resolve("./.env") });

console.log("✅ ENV loaded:", process.env.JWT_ACCESS_SECRET ? "OK" : "FAILED");
