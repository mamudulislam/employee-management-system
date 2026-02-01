import { Request, Response } from 'express';
import Asset from '../models/Asset';

export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await Asset.find().populate('assignedTo', 'name department');
        res.json(assets);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.create(req.body);
        res.status(201).json(asset);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const assignAsset = async (req: Request, res: Response) => {
    try {
        const { employeeId, assignedDate } = req.body;
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });

        const assignedDt = assignedDate ? new Date(assignedDate) : new Date();

        asset.status = 'Assigned';
        asset.assignedTo = employeeId;
        asset.assignedDate = assignedDt;
        asset.history.push({
            employee: employeeId,
            assignedDate: assignedDt
        });

        await asset.save();
        res.json(asset);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const returnAsset = async (req: Request, res: Response) => {
    try {
        const { returnDate, condition } = req.body;
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });

        // Update history
        if (asset.history.length > 0) {
            asset.history[asset.history.length - 1].returnDate = returnDate ? new Date(returnDate) : new Date();
            asset.history[asset.history.length - 1].conditionAtReturn = condition;
        }

        asset.status = 'Available';
        asset.assignedTo = undefined;
        asset.assignedDate = undefined;
        asset.condition = condition || asset.condition;

        await asset.save();

        res.json(asset);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
