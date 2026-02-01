// src/models/Employee.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IEmployee extends Document {
    employeeId: string;
    name: string;
    email: string;
    dob: Date;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    address: string;
    
    // Job Details
    department: string;
    designation: string;
    role: 'Admin' | 'Manager' | 'HR' | 'Employee';
    dateOfJoining: Date;
    status: 'Active' | 'On Leave' | 'Resigned' | 'Retired';
    
    // Emergency Contact
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    
    // Financial Info
    salary: number;
    bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
    };
    
    // Documents
    profilePicture?: string;
    documents: Array<{
        name: string;
        url: string;
        type: 'Resume' | 'ID Proof' | 'Certificate' | 'Other';
    }>;

    createdAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    
    department: { type: String, required: true },
    designation: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'HR', 'Employee'], default: 'Employee' },
    dateOfJoining: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'On Leave', 'Resigned', 'Retired'], default: 'Active' },
    
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true }
    },
    
    salary: { type: Number, required: true },
    bankDetails: {
        accountName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String }
    },
    
    profilePicture: { type: String },
    documents: [{
        name: { type: String },
        url: { type: String },
        type: { type: String, enum: ['Resume', 'ID Proof', 'Certificate', 'Other'] }
    }],

    createdAt: { type: Date, default: Date.now },
});

export default model<IEmployee>('Employee', employeeSchema);

