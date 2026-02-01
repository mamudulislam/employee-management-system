// src/controllers/payrollController.ts
import { Request, Response } from 'express';
import Payroll from '../models/Payroll';

export const getPayrolls = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        let query: any = {};
        if (month) query.month = parseInt(month as string);
        if (year) query.year = parseInt(year as string);

        const payrolls = await Payroll.find(query)
            .populate('employee', 'name department designation employeeId')
            .sort({ createdAt: -1 });
        res.json(payrolls);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const generatePayroll = async (req: Request, res: Response) => {
    try {
        const payroll = await Payroll.create(req.body);
        res.status(201).json(payroll);
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Payroll already generated for this month' });
        }
        res.status(400).json({ message: err.message });
    }
};

export const updatePayrollStatus = async (req: Request, res: Response) => {
    try {
        const { status, paymentDate } = req.body;
        const payroll = await Payroll.findByIdAndUpdate(
            req.params.id,
            { status, paymentDate },
            { new: true }
        );
        if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
        res.json(payroll);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getEmployeePayroll = async (req: Request, res: Response) => {
    try {
        const payrolls = await Payroll.find({ employee: req.params.employeeId })
            .sort({ year: -1, month: -1 });
        res.json(payrolls);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
