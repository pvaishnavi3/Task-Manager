import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import api from '../services/api';
import { socketService } from '../services/socket.service';
import { Notification } from '../types';

/**
 * Custom hook for notification management with real-time updates
 */
export const useNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const { data: notifications, error, isLoading } = useSWR<Notification[]>(
        'notifications',
        async () => {
            const response = await api.get<{ notifications: Notification[] }>('/notifications');
            return response.data.notifications;
        },
        {
            revalidateOnFocus: false,
        }
    );

    // Fetch unread count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await api.get<{ count: number }>('/notifications/unread-count');
                setUnreadCount(response.data.count);
            } catch (err) {
                console.error('Failed to fetch unread count:', err);
            }
        };

        fetchUnreadCount();
    }, [notifications]);

    // Listen for real-time notifications
    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) return;

        const handleNewNotification = (notification: any) => {
            mutate('notifications', (current: Notification[] | undefined) => {
                if (!current) return [notification];
                return [notification, ...current];
            }, false);
            setUnreadCount((prev) => prev + 1);
        };

        socketService.onNotification(handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            mutate('notifications');
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            mutate('notifications');
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
    };
};
