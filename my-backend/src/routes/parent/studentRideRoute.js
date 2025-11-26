import express from "express";
import scheduleController from "../../controllers/scheduleController.js"; // Sửa đường dẫn

const router = express.Router();

// Lấy danh sách học sinh trên 1 chuyến (timetable_id)
router.get("/:id", scheduleController.getStudentsOnTimetable);
// Thêm học sinh vào 1 chuyến
router.post("/", scheduleController.addStudentToTimetable);

export default router;