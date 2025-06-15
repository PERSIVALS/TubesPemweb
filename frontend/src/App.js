// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'; // Perbaikan: Tambahkan Link
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import halaman-halaman Admin (placeholder)
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageServiceTypesPage from './pages/admin/ManageServiceTypesPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';

// Import halaman-halaman User (placeholder)
import MyCarsPage from './pages/user/MyCarsPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import NewBookingPage from './pages/user/NewBookingPage';


const DashboardLayout = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className="is-flex" style={{ minHeight: '100vh' }}>
            <Sidebar />
            <main className="is-flex-grow-1 p-4 has-background-dark">
                <Outlet />
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']} />}>
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="users" element={<ManageUsersPage />} />
                        <Route path="service-types" element={<ManageServiceTypesPage />} />
                        <Route path="bookings" element={<ManageBookingsPage />} />
                    </Route>

                    <Route path="/user" element={<DashboardLayout allowedRoles={['user']} />}>
                        <Route path="dashboard" element={<UserDashboardPage />} />
                        <Route path="my-cars" element={<MyCarsPage />} />
                        <Route path="my-bookings" element={<MyBookingsPage />} />
                        <Route path="book-service" element={<NewBookingPage />} />
                    </Route>

                    <Route path="/unauthorized" element={
                        <section className="hero is-fullheight has-background-danger-dark has-text-light is-flex is-justify-content-center is-align-items-center">
                            <div className="hero-body">
                                <div className="container has-text-centered">
                                    <h1 className="title is-1 has-text-light mb-4">403 - Unauthorized Access</h1>
                                    <p className="subtitle is-4 has-text-danger-light mb-6">You do not have permission to view this page.</p>
                                    <Link to="/" className="button is-primary is-large is-rounded">
                                        Go to Home
                                    </Link>
                                </div>
                            </div>
                        </section>
                    } />

                    <Route path="*" element={
                        <section className="hero is-fullheight has-background-dark has-text-light is-flex is-justify-content-center is-align-items-center">
                            <div className="hero-body">
                                <div className="container has-text-centered">
                                    <h1 className="title is-1 has-text-light mb-4">404 - Page Not Found</h1>
                                    <p className="subtitle is-4 has-text-grey-light mb-6">The page you are looking for does not exist.</p>
                                    <Link to="/" className="button is-primary is-large is-rounded">
                                        Go to Home
                                    </Link>
                                </div>
                            </div>
                        </section>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;