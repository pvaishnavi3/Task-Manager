import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    // Handle known errors
    if (err.message === 'Email already registered') {
        return res.status(409).json({ error: err.message });
    }

    if (err.message === 'Invalid credentials') {
        return res.status(401).json({ error: err.message });
    }

    if (err.message === 'User not found' || err.message === 'Task not found') {
        return res.status(404).json({ error: err.message });
    }

    if (err.message.includes('Not authorized')) {
        return res.status(403).json({ error: err.message });
    }

    if (err.message.includes('Invalid or expired token')) {
        return res.status(401).json({ error: err.message });
    }

    if (err.message.includes('must be in the future')) {
        return res.status(400).json({ error: err.message });
    }

    // Default error
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
};
