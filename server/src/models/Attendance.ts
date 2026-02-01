// src/models/Attendance.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface IAttendance extends Document {
    employee: Types.ObjectId | IEmployee;
    date: Date;
    checkIn: Date;
    checkOut?: Date;
    status: 'Present' | 'Absent' | 'Late' | 'Half Day';
    type: 'Office' | 'Remote' | 'On Field';
    overtimeHours: number;
    shift: 'Morning' | 'Evening' | 'Night';
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
    remarks?: string;
}

const attendanceSchema = new Schema<IAttendance>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
    type: { type: String, enum: ['Office', 'Remote', 'On Field'], default: 'Office' },
    overtimeHours: { type: Number, default: 0 },
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    remarks: { type: String },
});

// Compound index to ensure one record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default model<IAttendance>('Attendance', attendanceSchema);

