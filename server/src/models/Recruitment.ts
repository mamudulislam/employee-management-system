// src/models/Recruitment.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IJobPost extends Document {
    title: string;
    department: string;
    description: string;
    requirements: string[];
    salaryRange: string;
    status: 'Open' | 'Closed' | 'Draft';
    createdAt: Date;
}

export interface ICandidate extends Document {
    jobPost: Types.ObjectId | IJobPost;
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
    interviews: Array<{
        date: Date;
        type: 'Technical' | 'HR' | 'Management';
        feedback: string;
        rating: number;
    }>;
    appliedDate: Date;
}

const jobPostSchema = new Schema<IJobPost>({
    title: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    salaryRange: { type: String },
    status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Draft' },
    createdAt: { type: Date, default: Date.now },
});

const candidateSchema = new Schema<ICandidate>({
    jobPost: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    interviews: [{
        date: Date,
        type: { type: String, enum: ['Technical', 'HR', 'Management'] },
        feedback: String,
        rating: Number
    }],
    appliedDate: { type: Date, default: Date.now },
});

export const JobPost = model<IJobPost>('JobPost', jobPostSchema);
export const Candidate = model<ICandidate>('Candidate', candidateSchema);
