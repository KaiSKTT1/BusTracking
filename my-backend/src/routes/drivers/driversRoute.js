import express from 'express';
import driversController from '../../controllers/driversController.js';

const router = express.Router();

// Route này chỉ nên gọi hàm controller, không chạy SQL
router.get('/', driversController.getAllDrivers);

// Các route khác
router.get('/:id', driversController.getDriverById);
router.post('/', driversController.createDriver);
router.put('/:id', driversController.updateDriver);
router.delete('/:id', driversController.deleteDriver);

export default router;