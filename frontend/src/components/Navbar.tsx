import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, LogOut, User, LayoutDashboard, ListTodo } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <ListTodo className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gradient">TaskManager</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link
                            to="/dashboard"
                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/tasks"
                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <ListTodo className="h-5 w-5" />
                            <span>Tasks</span>
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                <Bell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h3 className="font-semibold">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-sm text-primary-600 hover:text-primary-700"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="divide-y">
                                        {notifications && notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                                                        }`}
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <p className="text-sm">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="p-4 text-center text-gray-500">No notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <Link
                            to="/profile"
                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <User className="h-6 w-6" />
                            <span className="hidden md:block">{user?.name}</span>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-gray-700 hover:text-error transition-colors"
                        >
                            <LogOut className="h-6 w-6" />
                            <span className="hidden md:block">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
