import express from "express";
import scheduleController from "../../controllers/scheduleController.js"; // Sửa đường dẫn

const router = express.Router();

// Lấy lịch trình theo ngày. vd: /timetable/2025-10-20
router.get("/:date", scheduleController.getTimetableByDate);
router.post("/", scheduleController.createTimetable);

export default router;