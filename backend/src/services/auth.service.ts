import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto, UpdateUserDto } from '../dtos/auth.dto';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Authentication Service - Handles user authentication and authorization
 */
export class AuthService {
    /**
     * Register a new user
     * @throws Error if email already exists or validation fails
     */
    async register(data: RegisterDto) {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await userRepository.create(data.email, hashedPassword, data.name);

        // Generate JWT token
        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };
    }

    /**
     * Login user
     * @throws Error if credentials are invalid
     */
    async login(data: LoginDto) {
        // Find user
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };
    }

    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateUserDto) {
        // If email is being updated, check if it's already taken
        if (data.email) {
            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email already in use');
            }
        }

        const user = await userRepository.update(userId, data);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    /**
     * Generate JWT token
     */
    private generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Get all users (for task assignment)
     */
    async getAllUsers() {
        return await userRepository.findAll();
    }
}

export const authService = new AuthService();
