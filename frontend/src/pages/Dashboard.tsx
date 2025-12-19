import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/task.service';
import { TaskStatistics } from '../types';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState<TaskStatistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await taskService.getStatistics();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch statistics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card skeleton h-32"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your tasks and activities</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-primary-900">Assigned to Me</p>
                            <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.assignedToMe || 0}</p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-primary-600 opacity-50" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100 border-l-4 border-secondary-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-secondary-900">Created by Me</p>
                            <p className="text-3xl font-bold text-secondary-600 mt-2">{stats?.createdByMe || 0}</p>
                        </div>
                        <BarChart3 className="h-12 w-12 text-secondary-600 opacity-50" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-error">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-900">Overdue Tasks</p>
                            <p className="text-3xl font-bold text-error mt-2">{stats?.overdue || 0}</p>
                        </div>
                        <AlertCircle className="h-12 w-12 text-error opacity-50" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/tasks"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
                    >
                        <Clock className="h-8 w-8 text-primary-600 mb-2" />
                        <h3 className="font-semibold">View All Tasks</h3>
                        <p className="text-sm text-gray-600">Manage and organize your tasks</p>
                    </Link>
                    <Link
                        to="/tasks?filter=overdue"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-error hover:bg-red-50 transition-all"
                    >
                        <AlertCircle className="h-8 w-8 text-error mb-2" />
                        <h3 className="font-semibold">Overdue Tasks</h3>
                        <p className="text-sm text-gray-600">Review tasks past their due date</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
