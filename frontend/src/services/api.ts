import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance with default configuration
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
    (config) => {
        // Try localStorage first, then fall back to cookie
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            Cookies.remove('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
