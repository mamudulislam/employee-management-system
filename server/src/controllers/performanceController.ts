// src/controllers/performanceController.ts
import { Request, Response } from 'express';
import Performance from '../models/Performance';

export const getPerformanceReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Performance.find()
            .populate('employee', 'name department designation employeeId')
            .populate('reviewer', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createPerformanceReview = async (req: Request, res: Response) => {
    try {
        const review = await Performance.create(req.body);
        res.status(201).json(review);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updatePerformanceReview = async (req: Request, res: Response) => {
    try {
        const review = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getEmployeePerformance = async (req: Request, res: Response) => {
    try {
        const reviews = await Performance.find({ employee: req.params.employeeId })
            .populate('reviewer', 'name')
            .sort({ 'reviewPeriod.endDate': -1 });
        res.json(reviews);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
