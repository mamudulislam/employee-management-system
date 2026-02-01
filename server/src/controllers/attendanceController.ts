import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

export const getAttendance = async (req: Request, res: Response) => {
    try {
        const { date, department } = req.query;
        let query: any = {};
        if (date) query.date = new Date(date as string);

        const attendance = await Attendance.find(query)
            .populate('employee', 'name department designation employeeId')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const markAttendance = async (req: Request, res: Response) => {
    try {
        const { employee, date, checkIn, type, shift, location } = req.body;
        const attendance = await Attendance.create({
            employee,
            date: new Date(date),
            checkIn: new Date(checkIn),
            type,
            shift,
            location,
            status: 'Present'
        });
        res.status(201).json(attendance);
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }
        res.status(400).json({ message: err.message });
    }
};

export const updateAttendance = async (req: Request, res: Response) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
        res.json(attendance);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getEmployeeAttendance = async (req: Request, res: Response) => {
    try {
        const attendance = await Attendance.find({ employee: req.params.employeeId })
            .sort({ date: -1 });
        res.json(attendance);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
