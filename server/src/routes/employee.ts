// src/routes/employee.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from '../controllers/employeeController';

const router = Router();

router.use(protect);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
