import { taskRepository, TaskFilters, TaskSort } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../dtos/task.dto';
import { Priority, Status } from '../types';
import { notificationService } from './notification.service';
import { getIO } from '../socket';

/**
 * Task Service - Handles business logic for task management
 */
export class TaskService {
    /**
     * Create a new task
     * @throws Error if validation fails
     */
    async createTask(creatorId: string, data: CreateTaskDto) {
        console.log('Task service - createTask called with:', { creatorId, data });

        // Convert string date to Date object if needed
        const dueDate = typeof data.dueDate === 'string' ? new Date(data.dueDate) : data.dueDate;
        console.log('Parsed due date:', dueDate);

        // Validate due date is not in the past (allow today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('Today (midnight):', today);

        if (dueDate < today) {
            console.error('Due date validation failed:', { dueDate, today });
            throw new Error('Due date cannot be in the past');
        }

        const taskData = {
            title: data.title,
            description: data.description,
            dueDate,
            priority: data.priority as Priority,
            creatorId,
            assignedToId: data.assignedToId || null
        };

        console.log('Creating task with data:', taskData);
        const task = await taskRepository.create(taskData);
        const fullTask = await taskRepository.findById(task.id);

        // Create notification if task is assigned to someone
        if (data.assignedToId && data.assignedToId !== creatorId) {
            try {
                const notification = await notificationService.createTaskAssignmentNotification(
                    task.id,
                    data.assignedToId,
                    'Task Creator'
                );

                // Emit Socket.io event for real-time notification
                const io = getIO();
                io.to(data.assignedToId).emit('notification', notification);
                console.log('Notification created and emitted for user:', data.assignedToId);
            } catch (error) {
                console.error('Failed to create notification:', error);
            }
        }

        return fullTask;
    }

    /**
     * Get all tasks with filters and sorting
     */
    async getTasks(userId: string, filters: TaskFilterDto) {
        const taskFilters: TaskFilters = {};
        const taskSort: TaskSort = {};

        // Apply filters
        if (filters.status) {
            taskFilters.status = filters.status as Status;
        }

        if (filters.priority) {
            taskFilters.priority = filters.priority as Priority;
        }

        if (filters.assignedToMe) {
            taskFilters.assignedToId = userId;
        }

        if (filters.createdByMe) {
            taskFilters.creatorId = userId;
        }

        if (filters.overdue) {
            taskFilters.overdue = true;
        }

        // Apply sorting
        if (filters.sortBy) {
            taskSort.sortBy = filters.sortBy;
            taskSort.sortOrder = filters.sortOrder || 'asc';
        }

        return await taskRepository.findAll(taskFilters, taskSort);
    }

    /**
     * Get a single task by ID
     */
    async getTaskById(taskId: string) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    /**
     * Update a task
     * @throws Error if task not found or user not authorized
     */
    async updateTask(taskId: string, userId: string, data: UpdateTaskDto) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        console.log('Update task authorization check:', {
            taskId,
            userId,
            taskCreatorId: task.creatorId,
            taskAssignedToId: task.assignedToId,
            isCreator: task.creatorId === userId,
            isAssigned: task.assignedToId === userId
        });

        // Allow creator to update anything
        // Allow assigned user to update status only
        const isCreator = task.creatorId === userId;
        const isAssignee = task.assignedToId === userId;

        if (!isCreator && !isAssignee) {
            console.error('Authorization failed - user not creator or assignee');
            throw new Error('Not authorized to update this task');
        }

        // If user is assignee but not creator, only allow status updates
        if (isAssignee && !isCreator) {
            const allowedFields = ['status'];
            const updateFields = Object.keys(data);
            const hasDisallowedFields = updateFields.some(field => !allowedFields.includes(field));

            if (hasDisallowedFields) {
                console.error('Assignee tried to update non-status fields');
                throw new Error('Assigned users can only update task status');
            }
        }

        // Convert string date to Date object if needed
        const updateData: any = { ...data };
        if (data.dueDate) {
            updateData.dueDate = typeof data.dueDate === 'string' ? new Date(data.dueDate) : data.dueDate;
        }

        console.log('Updating task with data:', updateData);
        const updatedTask = await taskRepository.update(taskId, updateData);
        return await taskRepository.findById(updatedTask.id);
    }

    /**
     * Delete a task
     * @throws Error if task not found or user not authorized
     */
    async deleteTask(taskId: string, userId: string) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        // Only creator can delete task
        if (task.creatorId !== userId) {
            throw new Error('Not authorized to delete this task');
        }

        await taskRepository.delete(taskId);
    }

    /**
     * Get task statistics for dashboard
     */
    async getStatistics(userId: string) {
        return await taskRepository.getStatistics(userId);
    }

    /**
     * Check if a task is overdue
     */
    isTaskOverdue(dueDate: Date, status: Status): boolean {
        return new Date(dueDate) < new Date() && status !== Status.COMPLETED;
    }
}

export const taskService = new TaskService();
