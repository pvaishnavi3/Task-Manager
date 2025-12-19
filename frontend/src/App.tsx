import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import LoadingSkeleton from './components/LoadingSkeleton';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSkeleton />;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    useSocket(); // Initialize Socket.io connection

    return (
        <SWRConfig
            value={{
                refreshInterval: 0,
                revalidateOnFocus: false,
            }}
        >
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <Navbar />
                                    <main className="container mx-auto px-4 py-8">
                                        <Routes>
                                            <Route path="/" element={<Navigate to="/dashboard" />} />
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/tasks" element={<TaskList />} />
                                            <Route path="/profile" element={<Profile />} />
                                        </Routes>
                                    </main>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </SWRConfig>
    );
}

export default App;
