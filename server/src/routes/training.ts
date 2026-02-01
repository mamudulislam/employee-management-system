// src/routes/training.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getTrainings,
    createTraining,
    enrollEmployee,
    updateTrainingStatus
} from '../controllers/trainingController';

const router = Router();

router.use(protect);
router.get('/', getTrainings);
router.post('/', createTraining);
router.post('/:id/enroll', enrollEmployee);
router.patch('/:id/status', updateTrainingStatus);

export default router;
