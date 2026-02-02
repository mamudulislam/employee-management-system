// src/controllers/leaveController.ts
import { Request, Response } from 'express';
import Leave from '../models/Leave';

export const getLeaves = async (req: Request, res: Response) => {
    try {
        const leaves = await Leave.find()
            .populate('employee', 'name department designation employeeId')
            .sort({ appliedDate: -1 });
        
        // Debug: Check if Employee collection exists and has data
        const Employee = require('../models/Employee').default;
        const employeeCount = await Employee.countDocuments();
        console.log('Employee count:', employeeCount);
        
        // Debug: Check raw leave documents
        const rawLeaves = await Leave.find().lean();
        console.log('Raw leaves employee refs:', rawLeaves.map(l => ({
            id: l._id,
            employee: l.employee
        })));
        
        console.log('Populated leaves:', leaves.map(l => ({ 
            id: l._id, 
            employeeId: l.employee,
            employeeName: (l.employee as any)?.name || 'NULL'
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
        const { employeeName, ...leaveData } = req.body;
        
        // If the employee field is a User ID, we need to find the corresponding Employee
        let employeeRef = leaveData.employee;
        
        // Check if the employee reference exists in Employee collection
        const Employee = require('../models/Employee').default;
        const employee = await Employee.findById(employeeRef);
        
        // If not found as Employee, try to find Employee by email using User info
        if (!employee) {
            const User = require('../models/User').default;
            const user = await User.findById(employeeRef);
            if (user) {
                const employeeByEmail = await Employee.findOne({ email: user.email });
                if (employeeByEmail) {
                    employeeRef = employeeByEmail._id;
                } else {
                    // Create a new Employee record for the User
                    const newEmployee = await Employee.create({
                        employeeId: `EMP${Date.now()}`,
                        name: user.name,
                        email: user.email,
                        dob: new Date('1990-01-01'), // Default date
                        gender: 'Other',
                        phone: 'Not provided',
                        address: 'Not provided',
                        department: user.department || 'General',
                        designation: user.role === 'HR_ADMIN' ? 'HR Administrator' : 
                                     user.role === 'MANAGER' ? 'Manager' : 'Employee',
                        role: user.role === 'HR_ADMIN' ? 'HR' : 
                              user.role === 'MANAGER' ? 'Manager' : 'Employee',
                        dateOfJoining: new Date(),
                        status: 'Active',
                        emergencyContact: {
                            name: 'Not provided',
                            relationship: 'Not provided',
                            phone: 'Not provided'
                        },
                        salary: 0,
                        bankDetails: {
                            accountName: '',
                            accountNumber: '',
                            bankName: '',
                            ifscCode: ''
                        }
                    });
                    employeeRef = newEmployee._id;
                }
            }
        }
        
        const leave = await Leave.create({ ...leaveData, employee: employeeRef });
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
        ).populate('employee', 'name department designation employeeId');
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });
        res.json(leave);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getEmployeeLeaves = async (req: Request, res: Response) => {
    try {
        const leaves = await Leave.find({ employee: req.params.employeeId })
            .populate('employee', 'name department designation employeeId')
            .sort({ startDate: -1 });
        res.json(leaves);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
