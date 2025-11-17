import express from "express";
import reportController from "../../controllers/reportController.js"; // Sửa đường dẫn

const router = express.Router();

// GET /chitietbaocao/:id (lấy chi tiết của báo cáo có ID = :id)
router.get("/:id", reportController.getReportDetails);

// Bạn không cần POST ở đây, vì hàm createReport đã xử lý việc này rồi

export default router;