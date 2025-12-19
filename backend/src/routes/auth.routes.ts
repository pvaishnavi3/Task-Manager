import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { RegisterDtoSchema, LoginDtoSchema, UpdateUserDtoSchema } from '../dtos/auth.dto';

const router = express.Router();

/**
 * Authentication Routes
 */

// POST /api/auth/register - Register new user
router.post('/register', validate(RegisterDtoSchema), authController.register.bind(authController));

// POST /api/auth/login - Login user
router.post('/login', validate(LoginDtoSchema), authController.login.bind(authController));

// POST /api/auth/logout - Logout user
router.post('/logout', authController.logout.bind(authController));

// GET /api/auth/me - Get current user
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticate, validate(UpdateUserDtoSchema), authController.updateProfile.bind(authController));

// GET /api/auth/users - Get all users (for task assignment)
router.get('/users', authenticate, authController.getAllUsers.bind(authController));

export default router;
