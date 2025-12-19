import express from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { CreateTaskDtoSchema, UpdateTaskDtoSchema, TaskFilterDtoSchema } from '../dtos/task.dto';

const router = express.Router();

/**
 * Task Routes - All routes require authentication
 */

// GET /api/tasks/stats/dashboard - Get task statistics (must be before /:id route)
router.get('/stats/dashboard', authenticate, taskController.getStatistics.bind(taskController));

// POST /api/tasks - Create new task
router.post('/', authenticate, validate(CreateTaskDtoSchema), taskController.createTask.bind(taskController));

// GET /api/tasks - Get all tasks with filters
router.get('/', authenticate, validate(TaskFilterDtoSchema, 'query'), taskController.getTasks.bind(taskController));

// GET /api/tasks/:id - Get task by ID
router.get('/:id', authenticate, taskController.getTaskById.bind(taskController));

// PUT /api/tasks/:id - Update task
router.put('/:id', authenticate, validate(UpdateTaskDtoSchema), taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', authenticate, taskController.deleteTask.bind(taskController));

export default router;
