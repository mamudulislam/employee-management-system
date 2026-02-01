// src/controllers/recruitmentController.ts
import { Request, Response } from 'express';
import { JobPost, Candidate } from '../models/Recruitment';

export const getJobPosts = async (req: Request, res: Response) => {
    try {
        const jobs = await JobPost.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createJobPost = async (req: Request, res: Response) => {
    try {
        const job = await JobPost.create(req.body);
        res.status(201).json(job);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateJobPost = async (req: Request, res: Response) => {
    try {
        const job = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job post not found' });
        res.json(job);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await Candidate.find().populate('jobPost').sort({ appliedDate: -1 });
        res.json(candidates);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const applyForJob = async (req: Request, res: Response) => {
    try {
        const candidate = await Candidate.create(req.body);
        res.status(201).json(candidate);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
