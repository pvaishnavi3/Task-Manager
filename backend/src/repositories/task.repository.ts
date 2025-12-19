import { PrismaClient, Prisma } from '@prisma/client';
import { ITask, Priority, Status } from '../types';

const prisma = new PrismaClient();

export interface TaskFilters {
    status?: Status;
    priority?: Priority;
    assignedToId?: string;
    creatorId?: string;
    overdue?: boolean;
}

export interface TaskSort {
    sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Task Repository - Handles all database operations for tasks
 */
export class TaskRepository {
    /**
     * Create a new task
     */
    async create(data: {
        title: string;
        description: string;
        dueDate: Date;
        priority: Priority;
        creatorId: string;
        assignedToId?: string | null;
    }): Promise<ITask> {
        return await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                priority: data.priority,
                creatorId: data.creatorId,
                assignedToId: data.assignedToId || null
            }
        });
    }

    /**
     * Find task by ID with relations
     */
    async findById(id: string): Promise<any | null> {
        return await prisma.task.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { id: true, name: true, email: true }
                },
                assignedTo: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    /**
     * Find all tasks with filters and sorting
     */
    async findAll(filters: TaskFilters, sort: TaskSort): Promise<any[]> {
        const where: Prisma.TaskWhereInput = {};

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.priority) {
            where.priority = filters.priority;
        }

        if (filters.assignedToId) {
            where.assignedToId = filters.assignedToId;
        }

        if (filters.creatorId) {
            where.creatorId = filters.creatorId;
        }

        if (filters.overdue) {
            where.dueDate = { lt: new Date() };
            where.status = { not: Status.COMPLETED };
        }

        const orderBy: Prisma.TaskOrderByWithRelationInput = {};
        if (sort.sortBy) {
            orderBy[sort.sortBy] = sort.sortOrder || 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        return await prisma.task.findMany({
            where,
            orderBy,
            include: {
                creator: {
                    select: { id: true, name: true, email: true }
                },
                assignedTo: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    /**
     * Update a task
     */
    async update(id: string, data: Partial<ITask>): Promise<ITask> {
        return await prisma.task.update({
            where: { id },
            data
        });
    }

    /**
     * Delete a task
     */
    async delete(id: string): Promise<void> {
        await prisma.task.delete({
            where: { id }
        });
    }

    /**
     * Get task statistics for a user
     */
    async getStatistics(userId: string) {
        const [assignedToMe, createdByMe, overdue] = await Promise.all([
            prisma.task.count({ where: { assignedToId: userId } }),
            prisma.task.count({ where: { creatorId: userId } }),
            prisma.task.count({
                where: {
                    assignedToId: userId,
                    dueDate: { lt: new Date() },
                    status: { not: Status.COMPLETED }
                }
            })
        ]);

        return { assignedToMe, createdByMe, overdue };
    }
}

export const taskRepository = new TaskRepository();
