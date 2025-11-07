import { Router } from 'express';
import { ingestEvent, getSummary, getMySummary } from '../controllers/analyticsController.js';
import { optionalAuth, authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Ingest events (auth optional)
router.post('/events', optionalAuth, ingestEvent);

// Admin-only summary
router.get('/summary', authenticate, authorize('admin'), getSummary);

// User-specific analytics
router.get('/me', authenticate, getMySummary);

export default router;
