import { Priority, Status } from '@prisma/client';

// Re-export Prisma enums for convenience
export { Priority, Status };

export interface IUser {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITask {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotification {
    id: string;
    message: string;
    isRead: boolean;
    userId: string;
    taskId: string;
    createdAt: Date;
}

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}
