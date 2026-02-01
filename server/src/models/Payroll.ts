// src/models/Payroll.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface IPayroll extends Document {
    employee: Types.ObjectId | IEmployee;
    month: number;
    year: number;
    basicSalary: number;
    hra: number;
    allowances: {
        conveyance: number;
        medical: number;
        special: number;
        other: number;
    };
    deductions: {
        tax: number;
        socialSecurity: number;
        insurance: number;
        other: number;
    };
    bonus: number;
    netSalary: number;
    status: 'Pending' | 'Processed' | 'Paid';
    paymentDate?: Date;
    payslipUrl?: string;
    createdAt: Date;
}

const payrollSchema = new Schema<IPayroll>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: {
        conveyance: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        special: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    deductions: {
        tax: { type: Number, default: 0 },
        socialSecurity: { type: Number, default: 0 },
        insurance: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    bonus: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processed', 'Paid'], default: 'Pending' },
    paymentDate: { type: Date },
    payslipUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// One payroll record per employee per month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default model<IPayroll>('Payroll', payrollSchema);
