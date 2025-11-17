import express from "express";
import reportController from "../../controllers/reportController.js"; // Sửa đường dẫn

const router = express.Router();

router.get("/", reportController.getAllReports);
router.post("/", reportController.createReport);

export default router;