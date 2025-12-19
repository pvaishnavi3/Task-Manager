import api from './api';
import { AuthResponse, User } from '../types';

/**
 * Authentication Service - Handles all auth-related API calls
 */
export const authService = {
    /**
     * Register a new user
     */
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', {
            email,
            password,
            name,
        });

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));

        return response.data;
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        console.log('Login response:', response.data);
        console.log('Setting token in localStorage:', response.data.token);

        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        const tokenCheck = localStorage.getItem('token');
        console.log('Token stored, checking:', tokenCheck);

        return response.data;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    /**
     * Update user profile
     */
    async updateProfile(data: { name?: string; email?: string }): Promise<User> {
        const response = await api.put<{ user: User }>('/auth/profile', data);
        return response.data.user;
    },

    /**
     * Get all users (for task assignment)
     */
    async getAllUsers(): Promise<User[]> {
        const response = await api.get<{ users: User[] }>('/auth/users');
        return response.data.users;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        console.log('Checking authentication, token:', token ? 'exists' : 'missing');
        return !!token;
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    },
};
