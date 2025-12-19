import { Server, Socket } from 'socket.io';
import { notificationService } from '../services/notification.service';

let io: Server;

/**
 * Initialize the Socket.io server instance
 */
export const initializeIO = (socketServer: Server) => {
    io = socketServer;
};

/**
 * Get the Socket.io server instance
 */
export const getIO = (): Server => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

/**
 * Socket.io handler for real-time task updates and notifications
 */
export const setupSocketHandlers = (ioServer: Server) => {
    io = ioServer;

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Join user's personal room for notifications
        socket.on('join', (userId: string) => {
            socket.join(`user:${userId}`);
            console.log(`User ${userId} joined their room`);
        });

        // Broadcast task creation
        socket.on('task:created', (task: any) => {
            socket.broadcast.emit('task:created', task);

            // Notify assigned user if exists
            if (task.assignedToId) {
                io.to(`user:${task.assignedToId}`).emit('notification:new', {
                    message: `You have been assigned to task: "${task.title}"`,
                    taskId: task.id
                });
            }
        });

        // Broadcast task update
        socket.on('task:updated', async (data: { task: any; previousAssignedToId?: string }) => {
            socket.broadcast.emit('task:updated', data.task);

            // If assignment changed, notify the new assignee
            if (data.task.assignedToId && data.task.assignedToId !== data.previousAssignedToId) {
                io.to(`user:${data.task.assignedToId}`).emit('notification:new', {
                    message: `You have been assigned to task: "${data.task.title}"`,
                    taskId: data.task.id
                });
            }
        });

        // Broadcast task deletion
        socket.on('task:deleted', (taskId: string) => {
            socket.broadcast.emit('task:deleted', taskId);
        });

        // Broadcast task status change
        socket.on('task:status-changed', (data: { taskId: string; status: string; task: any }) => {
            socket.broadcast.emit('task:status-changed', data);
        });

        // Mark notification as read
        socket.on('notification:read', async (notificationId: string) => {
            await notificationService.markAsRead(notificationId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
