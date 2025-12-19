import useSWR, { mutate } from 'swr';
import { useEffect } from 'react';
import { taskService } from '../services/task.service';
import { socketService } from '../services/socket.service';
import { Task, TaskFilters } from '../types';

/**
 * Custom hook for task management with real-time updates
 */
export const useTasks = (filters?: TaskFilters) => {
    const key = filters ? ['tasks', JSON.stringify(filters)] : 'tasks';

    const { data, error, isLoading } = useSWR<Task[]>(
        key,
        () => taskService.getTasks(filters),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) return;

        // Listen for real-time task updates
        const handleTaskCreated = (task: Task) => {
            mutate(key, (current: Task[] | undefined) => {
                if (!current) return [task];
                return [task, ...current];
            }, false);
        };

        const handleTaskUpdated = (task: Task) => {
            mutate(key, (current: Task[] | undefined) => {
                if (!current) return [task];
                return current.map((t) => (t.id === task.id ? task : t));
            }, false);
        };

        const handleTaskDeleted = (taskId: string) => {
            mutate(key, (current: Task[] | undefined) => {
                if (!current) return [];
                return current.filter((t) => t.id !== taskId);
            }, false);
        };

        socketService.onTaskCreated(handleTaskCreated);
        socketService.onTaskUpdated(handleTaskUpdated);
        socketService.onTaskDeleted(handleTaskDeleted);

        return () => {
            socket.off('task:created', handleTaskCreated);
            socket.off('task:updated', handleTaskUpdated);
            socket.off('task:deleted', handleTaskDeleted);
        };
    }, [key]);

    const createTask = async (data: any) => {
        const task = await taskService.createTask(data);
        mutate(key);
        socketService.emitTaskCreated(task);
        return task;
    };

    const updateTask = async (id: string, data: any, previousAssignedToId?: string) => {
        const task = await taskService.updateTask(id, data);
        mutate(key);
        socketService.emitTaskUpdated(task, previousAssignedToId);
        return task;
    };

    const deleteTask = async (id: string) => {
        await taskService.deleteTask(id);
        mutate(key);
        socketService.emitTaskDeleted(id);
    };

    return {
        tasks: data,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
        mutate: () => mutate(key),
    };
};
