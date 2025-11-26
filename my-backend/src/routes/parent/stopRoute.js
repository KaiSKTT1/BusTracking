import express from "express";
import routeController from "../../controllers/routeController.js"; // Sửa đường dẫn

const router = express.Router();

// File này chỉ xử lý Stop
router.get("/", routeController.getAllStops); 
router.post("/", routeController.createStop);

export default router;