import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTasks } from '../hooks/useTasks';
import { Priority, Status, Task, CreateTaskDto } from '../types';
import { Plus, Edit2, Trash2, Calendar, User as UserIcon, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth.service';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    assignedToId: z.string().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const TaskList = () => {
    const [filters, setFilters] = useState<any>({});
    const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks(filters);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [users, setUsers] = useState<any[]>([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await authService.getAllUsers();
                setUsers(allUsers);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data: TaskFormData) => {
        try {
            const taskData: CreateTaskDto = {
                ...data,
                priority: data.priority as Priority,
                assignedToId: data.assignedToId || null,
            };

            if (editingTask) {
                await updateTask(editingTask.id, taskData, editingTask.assignedToId || undefined);
            } else {
                await createTask(taskData);
            }

            setShowModal(false);
            setEditingTask(null);
            reset();
        } catch (err) {
            console.error('Failed to save task:', err);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        reset({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.split('T')[0],
            priority: task.priority,
            assignedToId: task.assignedToId || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
        }
    };

    const handleStatusChange = async (task: Task, newStatus: Status) => {
        await updateTask(task.id, { status: newStatus }, task.assignedToId || undefined);
    };

    const getPriorityColor = (priority: Priority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-800',
            MEDIUM: 'bg-blue-100 text-blue-800',
            HIGH: 'bg-orange-100 text-orange-800',
            URGENT: 'bg-red-100 text-red-800',
        };
        return colors[priority];
    };

    const getStatusColor = (status: Status) => {
        const colors = {
            TODO: 'bg-gray-100 text-gray-800',
            IN_PROGRESS: 'bg-blue-100 text-blue-800',
            REVIEW: 'bg-purple-100 text-purple-800',
            COMPLETED: 'bg-green-100 text-green-800',
        };
        return colors[status];
    };

    const isOverdue = (dueDate: string, status: Status) => {
        return new Date(dueDate) < new Date() && status !== Status.COMPLETED;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-600">Manage and organize your tasks</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        reset({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedToId: '' });
                        setShowModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>New Task</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                        className="input-field"
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <select
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
                        className="input-field"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    <select
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value || undefined })}
                        className="input-field"
                    >
                        <option value="">Sort By</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="status">Status</option>
                        <option value="createdAt">Created Date</option>
                    </select>

                    <select
                        onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value || undefined })}
                        className="input-field"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card skeleton h-40"></div>
                    ))}
                </div>
            ) : tasks && tasks.length > 0 ? (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="card hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-semibold">{task.title}</h3>
                                        {isOverdue(task.dueDate, task.status) && (
                                            <AlertCircle className="h-5 w-5 text-error" />
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        <span className="flex items-center space-x-1 text-xs text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </span>
                                        {task.assignedTo && (
                                            <span className="flex items-center space-x-1 text-xs text-gray-600">
                                                <UserIcon className="h-4 w-4" />
                                                <span>{task.assignedTo.name}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                {['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(task, status as Status)}
                                        className={`text-xs px-3 py-1 rounded ${task.status === status
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No tasks found. Create your first task!</p>
                </div>
            )}

            {/* Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-6">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input {...register('title')} className="input-field" />
                                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea {...register('description')} rows={4} className="input-field" />
                                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input {...register('dueDate')} type="date" className="input-field" />
                                    {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select {...register('priority')} className="input-field">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                                <select {...register('assignedToId')} className="input-field">
                                    <option value="">Unassigned</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTask(null);
                                        reset();
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
