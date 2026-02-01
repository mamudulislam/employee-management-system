// src/routes/performance.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getPerformanceReviews,
    createPerformanceReview,
    updatePerformanceReview,
    getEmployeePerformance
} from '../controllers/performanceController';

const router = Router();

router.use(protect);
router.get('/', getPerformanceReviews);
router.post('/', createPerformanceReview);
router.put('/:id', updatePerformanceReview);
router.get('/employee/:employeeId', getEmployeePerformance);

export default router;
