import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { AuthRequest } from '../types';

/**
 * Notification Controller - Handles HTTP requests for notifications
 */
export class NotificationController {
    /**
     * Get all notifications for current user
     * GET /api/notifications
     */
    async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const notifications = await notificationService.getUserNotifications(userId);

            res.status(200).json({ notifications });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/:id/read
     */
    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            await notificationService.markAsRead(req.params.id);

            res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            await notificationService.markAllAsRead(userId);

            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get unread notification count
     * GET /api/notifications/unread-count
     */
    async getUnreadCount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const count = await notificationService.getUnreadCount(userId);

            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    }
}

export const notificationController = new NotificationController();
