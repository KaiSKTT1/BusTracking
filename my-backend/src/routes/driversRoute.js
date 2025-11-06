import express from 'express';
import driversController from '../controllers/driversController.js';

const router = express.Router();

router.get('/', driversController.getAllDrivers);

router.get('/:id', driversController.getDriverById);

router.post('/', driversController.createDriver);

router.put('/:id', driversController.updateDriver);

router.delete('/:id', driversController.deleteDriver);

export default router;
