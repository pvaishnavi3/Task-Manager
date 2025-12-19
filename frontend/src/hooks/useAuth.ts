import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types';

/**
 * Custom hook for authentication state management
 */
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await authService.login(email, password);
            setUser(response.user);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Login failed';
            setError(message);
            throw new Error(message);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            setError(null);
            const response = await authService.register(email, password, name);
            setUser(response.user);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Registration failed';
            setError(message);
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const updateProfile = async (data: { name?: string; email?: string }) => {
        try {
            setError(null);
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            return updatedUser;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Update failed';
            setError(message);
            throw new Error(message);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
    };
};
