import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';

/**
 * Authentication Controller - Handles HTTP requests for authentication
 */
export class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);

            // Set token in HTTP-only cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                message: 'User registered successfully',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);

            // Set token in HTTP-only cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const user = await authService.getUserProfile(userId);

            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user profile
     * PUT /api/auth/profile
     */
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const user = await authService.updateProfile(userId, req.body);

            res.status(200).json({
                message: 'Profile updated successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    }

    /**
     * Get all users (for task assignment)
     * GET /api/auth/users
     */
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await authService.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
