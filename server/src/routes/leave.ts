// src/routes/leave.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getLeaves,
    requestLeave,
    updateLeaveStatus,
    getEmployeeLeaves
} from '../controllers/leaveController';

const router = Router();

router.use(protect);
router.get('/', getLeaves);
router.post('/', requestLeave);
router.patch('/:id/status', updateLeaveStatus);
router.get('/employee/:employeeId', getEmployeeLeaves);

export default router;
