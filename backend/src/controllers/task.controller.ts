import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../types';

/**
 * Task Controller - Handles HTTP requests for task management
 */
export class TaskController {
    /**
     * Create a new task
     * POST /api/tasks
     */
    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('Create task request body:', req.body);
            const userId = (req as AuthRequest).user!.userId;
            console.log('User ID:', userId);

            const task = await taskService.createTask(userId, req.body);

            res.status(201).json({
                message: 'Task created successfully',
                task
            });
        } catch (error: any) {
            console.error('Task creation error:', error.message);
            console.error('Error stack:', error.stack);
            next(error);
        }
    }

    /**
     * Get all tasks with filters
     * GET /api/tasks
     */
    async getTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const tasks = await taskService.getTasks(userId, req.query);

            res.status(200).json({ tasks });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single task by ID
     * GET /api/tasks/:id
     */
    async getTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await taskService.getTaskById(req.params.id);

            res.status(200).json({ task });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a task
     * PUT /api/tasks/:id
     */
    async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const task = await taskService.updateTask(req.params.id, userId, req.body);

            res.status(200).json({
                message: 'Task updated successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a task
     * DELETE /api/tasks/:id
     */
    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            await taskService.deleteTask(req.params.id, userId);

            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get task statistics
     * GET /api/tasks/stats/dashboard
     */
    async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const stats = await taskService.getStatistics(userId);

            res.status(200).json({ stats });
        } catch (error) {
            next(error);
        }
    }
}

export const taskController = new TaskController();
