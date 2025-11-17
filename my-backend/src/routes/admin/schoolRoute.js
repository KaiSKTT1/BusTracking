import express from 'express';
import schoolController from '../../controllers/schoolController.js';

const router = express.Router();

router.get('/', schoolController.getAllSchools);
router.post('/', schoolController.createSchool);
router.put('/:id', schoolController.updateSchool);
router.delete('/:id', schoolController.deleteSchool);

export default router;