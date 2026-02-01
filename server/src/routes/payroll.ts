// src/routes/payroll.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getPayrolls,
    generatePayroll,
    updatePayrollStatus,
    getEmployeePayroll
} from '../controllers/payrollController';

const router = Router();

router.use(protect);
router.get('/', getPayrolls);
router.post('/generate', generatePayroll);
router.patch('/:id/status', updatePayrollStatus);
router.get('/employee/:employeeId', getEmployeePayroll);

export default router;
