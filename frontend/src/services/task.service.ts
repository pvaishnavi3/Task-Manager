import api from './api';
import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters, TaskStatistics } from '../types';

/**
 * Task Service - Handles all task-related API calls
 */
export const taskService = {
    /**
     * Create a new task
     */
    async createTask(data: CreateTaskDto): Promise<Task> {
        const response = await api.post<{ task: Task }>('/tasks', data);
        return response.data.task;
    },

    /**
     * Get all tasks with filters
     */
    async getTasks(filters?: TaskFilters): Promise<Task[]> {
        const params = new URLSearchParams();

        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.assignedToMe) params.append('assignedToMe', 'true');
        if (filters?.createdByMe) params.append('createdByMe', 'true');
        if (filters?.overdue) params.append('overdue', 'true');
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await api.get<{ tasks: Task[] }>(`/tasks?${params.toString()}`);
        return response.data.tasks;
    },

    /**
     * Get a single task by ID
     */
    async getTaskById(id: string): Promise<Task> {
        const response = await api.get<{ task: Task }>(`/tasks/${id}`);
        return response.data.task;
    },

    /**
     * Update a task
     */
    async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
        const response = await api.put<{ task: Task }>(`/tasks/${id}`, data);
        return response.data.task;
    },

    /**
     * Delete a task
     */
    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    /**
     * Get task statistics
     */
    async getStatistics(): Promise<TaskStatistics> {
        const response = await api.get<{ stats: TaskStatistics }>('/tasks/stats/dashboard');
        return response.data.stats;
    },
};
