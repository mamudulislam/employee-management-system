// src/models/Performance.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface IPerformance extends Document {
    employee: Types.ObjectId | IEmployee;
    reviewer: Types.ObjectId;
    reviewPeriod: {
        startDate: Date;
        endDate: Date;
    };
    kpis: Array<{
        name: string;
        target: string;
        achieved: string;
        rating: number; // 1-5
    }>;
    overallRating: number;
    feedback: string;
    goals: Array<{
        description: string;
        deadline: Date;
        status: 'Not Started' | 'In Progress' | 'Completed';
    }>;
    status: 'Draft' | 'Submitted' | 'Finalized';
    createdAt: Date;
}

const performanceSchema = new Schema<IPerformance>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewPeriod: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    kpis: [{
        name: { type: String, required: true },
        target: { type: String },
        achieved: { type: String },
        rating: { type: Number, min: 1, max: 5 }
    }],
    overallRating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    goals: [{
        description: { type: String },
        deadline: { type: Date },
        status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
    }],
    status: { type: String, enum: ['Draft', 'Submitted', 'Finalized'], default: 'Draft' },
    createdAt: { type: Date, default: Date.now },
});

export default model<IPerformance>('Performance', performanceSchema);
