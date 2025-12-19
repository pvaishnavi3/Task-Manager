import express from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import notificationRoutes from './notification.routes';

const router = express.Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
