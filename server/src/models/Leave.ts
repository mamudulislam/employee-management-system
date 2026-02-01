// src/models/Leave.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface ILeave extends Document {
    employee: Types.ObjectId | IEmployee;
    leaveType: 'Casual' | 'Sick' | 'Paid' | 'Unpaid' | 'Maternity' | 'Paternity';
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    appliedDate: Date;
    approvedBy?: Types.ObjectId;
    remarks?: string;
}

const leaveSchema = new Schema<ILeave>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: {
        type: String,
        enum: ['Casual', 'Sick', 'Paid', 'Unpaid', 'Maternity', 'Paternity'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    appliedDate: { type: Date, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },
});

export default model<ILeave>('Leave', leaveSchema);
