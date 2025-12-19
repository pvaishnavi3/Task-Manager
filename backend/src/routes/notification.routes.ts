import express from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * Notification Routes - All routes require authentication
 */

// GET /api/notifications - Get all notifications
router.get('/', authenticate, notificationController.getNotifications.bind(notificationController));

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', authenticate, notificationController.getUnreadCount.bind(notificationController));

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));

export default router;
