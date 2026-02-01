// src/models/Training.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface ITraining extends Document {
    title: string;
    description: string;
    trainer: string;
    startDate: Date;
    endDate: Date;
    type: 'Internal' | 'External' | 'Online';
    status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
    enrolledEmployees: Types.ObjectId[] | IEmployee[];
    completionRecords: Array<{
        employee: Types.ObjectId;
        status: 'Enrolled' | 'Completed' | 'Failed';
        score?: number;
        certificateUrl?: string;
    }>;
    createdAt: Date;
}

const trainingSchema = new Schema<ITraining>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    trainer: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, enum: ['Internal', 'External', 'Online'], required: true },
    status: { type: String, enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'], default: 'Planned' },
    enrolledEmployees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    completionRecords: [{
        employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
        status: { type: String, enum: ['Enrolled', 'Completed', 'Failed'], default: 'Enrolled' },
        score: Number,
        certificateUrl: String
    }],
    createdAt: { type: Date, default: Date.now },
});

export default model<ITraining>('Training', trainingSchema);
