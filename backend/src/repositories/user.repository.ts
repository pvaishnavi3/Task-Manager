import { PrismaClient } from '@prisma/client';
import { IUser } from '../types';

const prisma = new PrismaClient();

/**
 * User Repository - Handles all database operations for users
 */
export class UserRepository {
    /**
     * Find a user by email
     */
    async findByEmail(email: string): Promise<IUser | null> {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    /**
     * Find a user by ID
     */
    async findById(id: string): Promise<IUser | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    /**
     * Create a new user
     */
    async create(email: string, hashedPassword: string, name: string): Promise<IUser> {
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    /**
     * Update user information
     */
    async update(id: string, data: { name?: string; email?: string }): Promise<IUser> {
        return await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    /**
     * Get all users (for task assignment)
     */
    async findAll(): Promise<Omit<IUser, 'password'>[]> {
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
}

export const userRepository = new UserRepository();
