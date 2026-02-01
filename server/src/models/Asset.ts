// src/models/Asset.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IEmployee } from './Employee';

export interface IAsset extends Document {
    assetId: string;
    name: string;
    type: 'Laptop' | 'Mobile' | 'Peripheral' | 'Other';
    serialNumber: string;
    status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
    assignedTo?: Types.ObjectId | IEmployee;
    assignedDate?: Date;
    returnDate?: Date;
    condition: 'New' | 'Good' | 'Fair' | 'Poor';
    history: Array<{
        employee: Types.ObjectId;
        assignedDate: Date;
        returnDate?: Date;
        conditionAtReturn?: string;
    }>;
    createdAt: Date;
}

const assetSchema = new Schema<IAsset>({
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Laptop', 'Mobile', 'Peripheral', 'Other'], required: true },
    serialNumber: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Assigned', 'Maintenance', 'Retired'], default: 'Available' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee' },
    assignedDate: { type: Date },
    returnDate: { type: Date },
    condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor'], default: 'New' },
    history: [{
        employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
        assignedDate: { type: Date },
        returnDate: { type: Date },
        conditionAtReturn: String
    }],
    createdAt: { type: Date, default: Date.now },
});

export default model<IAsset>('Asset', assetSchema);
