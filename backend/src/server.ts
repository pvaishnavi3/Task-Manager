import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { setupSocketHandlers } from './socket';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'https://task-manager-frontend-5pkh.onrender.com'
        ],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://task-manager-frontend-5pkh.onrender.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root health check (works in all environments)
app.get("/", (_req, res) => {
    res.json({
        message: "Task Manager API is running",
        status: "ok",
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api', routes);

// Setup Socket.io handlers
setupSocketHandlers(io);

// Make io available to routes
app.set('io', io);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export { app, io };
