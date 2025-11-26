import express from "express";
import scheduleController from "../../controllers/scheduleController.js";

const router = express.Router();

// === ROUTE CHUNG ===
router.get("/", scheduleController.getAllTimetables);
router.post("/", scheduleController.createTimetable);

// === ROUTE ƯU TIÊN (không được để sau route :date) ===
router.get("/driver/:driverId/students", scheduleController.getStudentsByDriver);
//router.get("/driver/:driverId/date/:date/students", scheduleController.getStudentsByDriverAndDate);

// === ROUTE MỚI: lọc theo driver + bus + date ===
router.get(
    "/driver/:driverId/bus/:busId/date/:date/students",
    scheduleController.getStudentsByDriverBusAndDate
);
router.get(
    "/driver/:driverId/date/:date/buses",
    scheduleController.getBusesByDriverAndDate
);

// === ROUTE LẤY ROUTE (Tuyến xe) CỦA DRIVER ===
router.get("/driver/:driverId/routes", scheduleController.getRoutesByDriver);

// === ROUTE CUỐI CÙNG (PARAM DỄ BỊ NUỐT) ===
router.get("/:date", scheduleController.getTimetableByDate);

export default router;
