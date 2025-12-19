import { notificationRepository } from '../repositories/notification.repository';
import { taskRepository } from '../repositories/task.repository';

/**
 * Notification Service - Handles notification creation and management
 */
export class NotificationService {
    /**
     * Create a task assignment notification
     */
    async createTaskAssignmentNotification(taskId: string, assignedToId: string, assignerName: string) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        const message = `${assignerName} assigned you to task: "${task.title}"`;
        return await notificationRepository.create(assignedToId, taskId, message);
    }

    /**
     * Create a task update notification
     */
    async createTaskUpdateNotification(taskId: string, userId: string, updateType: string) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        const message = `Task "${task.title}" ${updateType}`;
        return await notificationRepository.create(userId, taskId, message);
    }

    /**
     * Get all notifications for a user
     */
    async getUserNotifications(userId: string) {
        return await notificationRepository.findByUserId(userId);
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string) {
        return await notificationRepository.markAsRead(notificationId);
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string) {
        await notificationRepository.markAllAsRead(userId);
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId: string) {
        return await notificationRepository.getUnreadCount(userId);
    }
}

export const notificationService = new NotificationService();
