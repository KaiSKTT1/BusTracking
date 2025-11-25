import express from "express";
import scheduleController from "../../controllers/scheduleController.js";

const router = express.Router();

// === ROUTE CHUNG ===
router.get("/", scheduleController.getAllTimetables);
router.post("/", scheduleController.createTimetable);

// === ROUTE ƯU TIÊN (có prefix /driver) ===
router.get("/driver/:driverId/students", scheduleController.getStudentsByDriver);
router.get("/driver/:driverId/date/:date/students", scheduleController.getStudentsByDriverAndDate);
router.get("/driver/:driverId/routes", scheduleController.getRoutesByDriver);

// === ROUTE CUỐI CÙNG (PARAM DỄ BỊ NUỐT) ===
// Lấy timetable theo ngày
router.get("/:date", scheduleController.getTimetableByDate);

export default router;
