// src/routes/attendance.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getAttendance,
    markAttendance,
    updateAttendance,
    getEmployeeAttendance
} from '../controllers/attendanceController';

const router = Router();

router.use(protect);
router.get('/', getAttendance);
router.post('/', markAttendance);
router.put('/:id', updateAttendance);
router.get('/employee/:employeeId', getEmployeeAttendance);

export default router;
