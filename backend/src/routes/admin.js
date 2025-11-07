import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getUserAnalytics, getUsers, updateUserStatus } from '../controllers/adminController.js';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorize('admin'));

// User analytics
router.get('/analytics/users', getUserAnalytics);

// User management
router.get('/users', getUsers);
router.patch('/users/:userId/status', updateUserStatus);

export default router;
