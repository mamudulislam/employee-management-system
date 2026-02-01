// src/controllers/leaveController.ts
import { Request, Response } from 'express';
import Leave from '../models/Leave';

export const getLeaves = async (req: Request, res: Response) => {
    try {
        const leaves = await Leave.find()
            .populate({
                path: 'employee',
                select: 'name department designation employeeId',
                model: 'Employee'
            })
            .sort({ appliedDate: -1 });
        
        // Add debugging to see populate results
        console.log('Leaves with populate:', leaves.map(l => ({ 
            id: l._id, 
            employeeId: l.employee,
            employeeName: l.employee?.name || 'NULL'
        })));
        
        res.json({
            success: true,
            data: leaves
        });
    } catch (err: any) {
        console.error('Get leaves error:', err);
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

export const requestLeave = async (req: Request, res: Response) => {
    try {
        // Extract employeeName but don't store it in the database
        // The employee name will come from the populated employee reference
        const { employeeName, ...leaveData } = req.body;
        
        const leave = await Leave.create(leaveData);
        const populatedLeave = await Leave.findById(leave._id)
            .populate('employee', 'name department designation employeeId');
            
        res.status(201).json({
            success: true,
            data: populatedLeave
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            message: err.message 
        });
    }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
    try {
        const { status, remarks, approvedBy } = req.body;
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status, remarks, approvedBy },
            { new: true }
        );
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });
        res.json(leave);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getEmployeeLeaves = async (req: Request, res: Response) => {
    try {
        const leaves = await Leave.find({ employee: req.params.employeeId })
            .sort({ startDate: -1 });
        res.json(leaves);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
