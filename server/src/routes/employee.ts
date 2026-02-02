// src/routes/employee.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    deleteBulkEmployees,
} from '../controllers/employeeController';

const router = Router();

router.use(protect);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.post('/bulk-delete', deleteBulkEmployees);
router.delete('/:id', deleteEmployee);

export default router;
