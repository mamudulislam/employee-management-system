import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
    department?: string;
    avatar?: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE'], default: 'EMPLOYEE' },
    department: { type: String },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default model<IUser>('User', userSchema);
