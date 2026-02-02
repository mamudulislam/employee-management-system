// src/controllers/employeeController.ts
import { Request, Response } from 'express';
import Employee from '../models/Employee';

// @desc   Get all employees (with optional pagination, search, filter)
export const getEmployees = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const query = search
            ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : {};
        const employees = await Employee.find(query)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        const total = await Employee.countDocuments(query);
        res.json({ data: employees, total, page: pageNum, limit: limitNum });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Get single employee by ID
export const getEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Create new employee
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err: any) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc   Update employee
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc   Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc   Delete multiple employees
export const deleteBulkEmployees = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Please provide an array of employee IDs' });
        }
        await Employee.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Employees removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
