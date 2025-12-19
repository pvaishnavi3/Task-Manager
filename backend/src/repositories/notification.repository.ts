import { PrismaClient } from '@prisma/client';
import { INotification } from '../types';

const prisma = new PrismaClient();

/**
 * Notification Repository - Handles all database operations for notifications
 */
export class NotificationRepository {
    /**
     * Create a new notification
     */
    async create(userId: string, taskId: string, message: string): Promise<INotification> {
        return await prisma.notification.create({
            data: {
                userId,
                taskId,
                message
            }
        });
    }

    /**
     * Get all notifications for a user
     */
    async findByUserId(userId: string): Promise<any[]> {
        return await prisma.notification.findMany({
            where: { userId },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string): Promise<INotification> {
        return await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<void> {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return await prisma.notification.count({
            where: { userId, isRead: false }
        });
    }
}

export const notificationRepository = new NotificationRepository();
