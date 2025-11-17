import express from "express";
import routeController from "../../controllers/routeController.js"; 

const router = express.Router();

// Lấy TẤT CẢ tuyến đường (cho danh sách bên trái)
router.get("/", routeController.getAllRoutes); 

// Lấy TẤT CẢ trạm dừng CỦA 1 TUYẾN (để vẽ map)
router.get("/:id/stops", routeController.getStopsByRouteId);

// (Các hàm quản lý route khác)
router.post("/", routeController.createRoute);
router.delete("/:id", routeController.deleteRoute);
router.post("/addstop", routeController.addStopToRoute); // Thêm liên kết

export default router;