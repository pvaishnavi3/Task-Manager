import { useEffect } from 'react';
import { socketService } from '../services/socket.service';
import { useAuth } from './useAuth';

/**
 * Custom hook for Socket.io connection management
 */
export const useSocket = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Connect to Socket.io server
            socketService.connect(user.id);

            return () => {
                // Cleanup on unmount
                socketService.disconnect();
            };
        }
    }, [user]);

    return socketService;
};
