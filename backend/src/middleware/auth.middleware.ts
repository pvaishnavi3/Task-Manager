import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';

/**
 * Authentication middleware - Verifies JWT token and attaches user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies?.token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const payload = authService.verifyToken(token);

        // Attach user to request
        (req as AuthRequest).user = payload;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
