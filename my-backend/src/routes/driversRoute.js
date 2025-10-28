import express from 'express';
import driversController from '../controllers/driversController.js';


const router = express.Router();

router.get('/', driversController.getAllDrivers);

router.get('/:id', driversController.getDriverById);

router.post('/', driversController.createDriver);

router.put('/:id', driversController.updateDriver);

router.delete('/:id', driversController.deleteDriver);
router.post("/notify/picked-up", driversController.sendPickedUpNotification);
router.post("/notify/not-picked-up", driversController.sendNotPickedUpNotification);
router.post("/notify/incident", driversController.sendIncidentNotification);

export default router;
