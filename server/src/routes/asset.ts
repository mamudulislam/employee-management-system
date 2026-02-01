// src/routes/asset.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getAssets,
    createAsset,
    assignAsset,
    returnAsset,
    updateAsset
} from '../controllers/assetController';

const router = Router();

router.use(protect);
router.get('/', getAssets);
router.post('/', createAsset);
router.post('/:id/assign', assignAsset);
router.post('/:id/return', returnAsset);
router.put('/:id', updateAsset);

export default router;
