import { z } from 'zod';

/**
 * DTO for creating a new task
 */
export const CreateTaskDtoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format'
    }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, HIGH, or URGENT' })
    }),
    assignedToId: z.string().uuid('Invalid user ID').optional().nullable()
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

/**
 * DTO for updating an existing task
 */
export const UpdateTaskDtoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format'
    }).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    assignedToId: z.string().uuid('Invalid user ID').optional().nullable()
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;

/**
 * DTO for filtering tasks
 */
export const TaskFilterDtoSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedToMe: z.string().transform(val => val === 'true').optional(),
    createdByMe: z.string().transform(val => val === 'true').optional(),
    overdue: z.string().transform(val => val === 'true').optional(),
    sortBy: z.enum(['dueDate', 'createdAt', 'priority', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});

export type TaskFilterDto = z.infer<typeof TaskFilterDtoSchema>;
