import express from "express";
import scheduleController from "../../controllers/scheduleController.js"; // Sửa đường dẫn

const router = express.Router();

router.get("/", scheduleController.getAllTrips);
router.post("/", scheduleController.createTrip);

export default router;