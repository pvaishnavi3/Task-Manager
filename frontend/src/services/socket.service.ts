import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    /**
     * Connect to Socket.io server
     */
    connect(userId: string): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
            // Join user's personal room
            this.socket?.emit('join', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect from Socket.io server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Get current socket instance
     */
    getSocket(): Socket | null {
        return this.socket;
    }

    /**
     * Emit task created event
     */
    emitTaskCreated(task: any): void {
        this.socket?.emit('task:created', task);
    }

    /**
     * Emit task updated event
     */
    emitTaskUpdated(task: any, previousAssignedToId?: string): void {
        this.socket?.emit('task:updated', { task, previousAssignedToId });
    }

    /**
     * Emit task deleted event
     */
    emitTaskDeleted(taskId: string): void {
        this.socket?.emit('task:deleted', taskId);
    }

    /**
     * Emit task status changed event
     */
    emitTaskStatusChanged(taskId: string, status: string, task: any): void {
        this.socket?.emit('task:status-changed', { taskId, status, task });
    }

    /**
     * Listen for task created events
     */
    onTaskCreated(callback: (task: any) => void): void {
        this.socket?.on('task:created', callback);
    }

    /**
     * Listen for task updated events
     */
    onTaskUpdated(callback: (task: any) => void): void {
        this.socket?.on('task:updated', callback);
    }

    /**
     * Listen for task deleted events
     */
    onTaskDeleted(callback: (taskId: string) => void): void {
        this.socket?.on('task:deleted', callback);
    }

    /**
     * Listen for task status changed events
     */
    onTaskStatusChanged(callback: (data: { taskId: string; status: string; task: any }) => void): void {
        this.socket?.on('task:status-changed', callback);
    }

    /**
     * Listen for new notifications
     */
    onNotification(callback: (notification: any) => void): void {
        this.socket?.on('notification:new', callback);
    }

    /**
     * Remove all listeners
     */
    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }
}

export const socketService = new SocketService();
