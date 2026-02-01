// src/routes/recruitment.ts
import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    getJobPosts,
    createJobPost,
    updateJobPost,
    getCandidates,
    applyForJob,
    updateCandidateStatus
} from '../controllers/recruitmentController';

const router = Router();

router.get('/jobs', getJobPosts);
router.post('/jobs', protect, createJobPost);
router.put('/jobs/:id', protect, updateJobPost);
router.get('/candidates', protect, getCandidates);
router.post('/apply', applyForJob);
router.patch('/candidates/:id/status', protect, updateCandidateStatus);

export default router;
