export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    COMPLETED = 'COMPLETED'
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId: string | null;
    createdAt: string;
    updatedAt: string;
    creator?: {
        id: string;
        name: string;
        email: string;
    };
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface Notification {
    id: string;
    message: string;
    isRead: boolean;
    userId: string;
    taskId: string;
    createdAt: string;
    task?: {
        id: string;
        title: string;
        status: Status;
        priority: Priority;
    };
}

export interface CreateTaskDto {
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    assignedToId?: string | null;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
    status?: Status;
    assignedToId?: string | null;
}

export interface TaskFilters {
    status?: Status;
    priority?: Priority;
    assignedToMe?: boolean;
    createdByMe?: boolean;
    overdue?: boolean;
    sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface TaskStatistics {
    assignedToMe: number;
    createdByMe: number;
    overdue: number;
}
