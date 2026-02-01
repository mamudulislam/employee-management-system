// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// @desc   Register a new user (admin only)
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, department, avatar } = req.body;
        // Simple role check – in a real app you would verify req.user.role === 'admin'
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashed, role, department, avatar });
        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, avatar: user.avatar });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// @desc   Login and return JWT
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
