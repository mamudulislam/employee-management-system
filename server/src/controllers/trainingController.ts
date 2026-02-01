// src/controllers/trainingController.ts
import { Request, Response } from 'express';
import Training from '../models/Training';

export const getTrainings = async (req: Request, res: Response) => {
    try {
        const trainings = await Training.find().populate('enrolledEmployees', 'name department');
        res.json(trainings);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createTraining = async (req: Request, res: Response) => {
    try {
        const training = await Training.create(req.body);
        res.status(201).json(training);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const enrollEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.body;
        const training = await Training.findById(req.params.id);
        if (!training) return res.status(404).json({ message: 'Training not found' });

        // Add to enrolled employees if not already there
        if (!training.enrolledEmployees.includes(employeeId)) {
            training.enrolledEmployees.push(employeeId);
            training.completionRecords.push({ employee: employeeId, status: 'Enrolled' });
            await training.save();
        }
        res.json(training);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateTrainingStatus = async (req: Request, res: Response) => {
    try {
        const training = await Training.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!training) return res.status(404).json({ message: 'Training not found' });
        res.json(training);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
