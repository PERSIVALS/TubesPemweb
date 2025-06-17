// frontend/src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // In a real app, these would be separate API endpoints or a single dashboard endpoint
                const [usersResponse, bookingsResponse, serviceTypesResponse] = await Promise.all([
                    axiosClient.get('/users'),
                    axiosClient.get('/bookings'),
                    axiosClient.get('/service-types')
                ]);

                const users = usersResponse.data;
                const bookings = bookingsResponse.data;
                const serviceTypes = serviceTypesResponse.data;

                // Calculate revenue from completed bookings
                const completedBookings = bookings.filter(booking => booking.status === 'completed');
                const totalRevenue = completedBookings.reduce((sum, booking) => {
                    const serviceType = serviceTypes.find(st => st.serviceTypeId === booking.serviceTypeId);
                    return sum + (serviceType ? parseFloat(serviceType.price) : 0);
                }, 0);

                setStats({
                    totalUsers: users.length,
                    pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
                    completedBookings: completedBookings.length,
                    totalRevenue: totalRevenue,
                    recentBookings: bookings.slice(0, 5) // Most recent 5 bookings
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="large" message="Loading dashboard data..." />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-8 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-blue-100 text-lg">
                            Welcome back, <span className="font-semibold">{user?.name || user?.username}</span>! Here's what's happening.
                        </p>
                    </motion.div>

                    {/* Stats Overview */}
                    <motion.div
                        className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4"
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div 
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20"
                            variants={fadeIn}
                        >
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-purple-500 bg-opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-100">Total Users</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20"
                            variants={fadeIn}
                        >
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-amber-500 bg-opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-100">Pending Bookings</p>
                                    <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20"
                            variants={fadeIn}
                        >
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-emerald-500 bg-opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-100">Completed Services</p>
                                    <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20"
                            variants={fadeIn}
                        >
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-500 bg-opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-100">Total Revenue</p>
                                    <p className="text-2xl font-bold text-white">Rp{stats.totalRevenue.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Quick Actions */}
                <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div 
                            className="bg-white overflow-hidden shadow-lg rounded-xl"
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-8 relative">
                                <div className="absolute top-0 right-0 -mt-4 mr-16 w-24 h-24 rounded-full bg-purple-400 opacity-20 blur-2xl"></div>
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-white">Manage Users</h3>
                                    <p className="mt-2 text-purple-100">View, create, edit, or delete user accounts.</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-white">
                                <Link 
                                    to="/admin/users" 
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    Go to Users
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white overflow-hidden shadow-lg rounded-xl"
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-8 relative">
                                <div className="absolute top-0 right-0 -mt-4 mr-16 w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-white">Service Types</h3>
                                    <p className="mt-2 text-indigo-100">Define and manage available service categories.</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-white">
                                <Link 
                                    to="/admin/service-types" 
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Go to Service Types
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white overflow-hidden shadow-lg rounded-xl"
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-8 relative">
                                <div className="absolute top-0 right-0 -mt-4 mr-16 w-24 h-24 rounded-full bg-amber-400 opacity-20 blur-2xl"></div>
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-white">Manage Bookings</h3>
                                    <p className="mt-2 text-amber-100">Overview and control of all service appointments.</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-white">
                                <Link 
                                    to="/admin/bookings" 
                                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    Go to Bookings
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* System Overview */}
                    <motion.div 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
                            </div>
                            <div className="px-6 py-5">
                                {stats.recentBookings.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {stats.recentBookings.map((booking) => (
                                            <li key={booking.bookingId} className="py-4">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                                        booking.status === 'completed' ? 'bg-emerald-100' :
                                                        booking.status === 'confirmed' ? 'bg-blue-100' :
                                                        booking.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                                                    }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                            booking.status === 'completed' ? 'text-emerald-600' :
                                                            booking.status === 'confirmed' ? 'text-blue-600' :
                                                            booking.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {booking.user?.name || 'User'} - {booking.car ? `${booking.car.make} ${booking.car.model}` : 'No Car'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(booking.bookingDate).toLocaleDateString()} • {booking.serviceType?.name || 'Unknown Service'}
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className={`inline-flex rounded-full uppercase px-2 text-xs font-semibold leading-5 ${
                                                            booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
                                    </div>
                                )}
                                <div className="mt-6 text-center">
                                    <Link to="/admin/bookings" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                        View all bookings
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity Panel */}
                    <motion.div 
                        className="lg:row-span-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden h-full">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">System Status</h3>
                            </div>
                            <div className="px-6 py-5">
                                <ul className="space-y-5">
                                    <li className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">API Status</h4>
                                            <p className="text-sm text-gray-500">All systems operational</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">Database</h4>
                                            <p className="text-sm text-gray-500">Connected and optimized</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">Security</h4>
                                            <p className="text-sm text-gray-500">All protections active</p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-6 pt-5 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium text-gray-900">Server Load</h4>
                                        <span className="text-sm text-gray-500">16%</span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '16%' }}></div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <h4 className="text-sm font-medium text-gray-900">Storage</h4>
                                        <span className="text-sm text-gray-500">42%</span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Analytics or Components */}
                <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-8 sm:p-10 sm:pb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Application Updates</h3>
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                                    New
                                </span>
                            </div>
                            <div className="mt-5 text-white sm:mt-8 sm:flex sm:items-center sm:justify-between">
                                <div className="text-sm">
                                    <p>New features available:</p>
                                    <ul className="mt-3 space-y-2">
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            SMS notifications for bookings
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Advanced reporting tools
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Integration with payment providers
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-6 sm:mt-0">
                                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-rose-700 focus:ring-white transition-colors">
                                        View all updates
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pt-6 pb-8 bg-rose-50">
                            <div className="flex items-center">
                                <h4 className="flex-shrink-0 pr-4 text-sm font-semibold tracking-wider text-rose-800 uppercase">
                                    What's included
                                </h4>
                                <div className="flex-1 border-t-2 border-rose-200"></div>
                            </div>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-sm text-rose-700">Dedicated technical support</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-sm text-rose-700">Regular feature updates and security patches</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-sm text-rose-700">Advanced analytics dashboard</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
