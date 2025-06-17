// frontend/src/pages/UserDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';


const UserDashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [activityError, setActivityError] = useState('');
    const [stats, setStats] = useState({
        totalCars: 0,
        activeBookings: 0,
        completedServices: 0
    });

    useEffect(() => {
        const fetchRecentActivities = async () => {
            if (!user) {
                setLoadingActivities(false);
                return;
            }
            try {
                setLoadingActivities(true);
                setActivityError('');
                const response = await axiosClient.get('/bookings/recent');
                setRecentActivities(response.data);
                
                // Also fetch user stats
                const carsResponse = await axiosClient.get('/cars');
                const bookingsResponse = await axiosClient.get('/bookings');
                
                setStats({
                    totalCars: carsResponse.data.length,
                    activeBookings: bookingsResponse.data.filter(b => 
                        b.status === 'pending' || b.status === 'confirmed').length,
                    completedServices: bookingsResponse.data.filter(b => 
                        b.status === 'completed').length
                });
                
            } catch (err) {
                console.error('Gagal mengambil aktivitas terbaru:', err);
                setActivityError(err.response?.data?.message || 'Gagal memuat aktivitas terbaru.');
            } finally {
                setLoadingActivities(false);
            }
        };

        fetchRecentActivities();
    }, [user]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-lg text-gray-700">Memuat dashboard pengguna...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header with Profile Card */}
                <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex items-center">
                        <div className="p-8 md:p-12 md:w-2/3">
                            <h1 className="text-3xl font-extrabold text-white leading-tight">
                                Selamat Datang, {user.name || user.username}!
                            </h1>
                            <p className="mt-2 text-blue-100">
                                Apa yang ingin Anda lakukan hari ini? Kelola kendaraan, lihat jadwal, atau buat pemesanan baru.
                            </p>
                        </div>
                        <div className="hidden md:block md:w-1/3 p-8">
                            <div className="flex justify-end">
                                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mb-4">
                                        <span className="text-xl font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="text-white text-xs uppercase tracking-wide font-semibold">Akun Anda</div>
                                    <div className="text-blue-100 text-sm mt-1">{user.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <div className="text-xl font-semibold text-gray-900">{stats.totalCars}</div>
                                    <div className="mt-1 text-sm text-gray-600">Mobil Terdaftar</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <Link to="/user/my-cars" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                                Kelola Mobil Anda
                                <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <div className="text-xl font-semibold text-gray-900">{stats.activeBookings}</div>
                                    <div className="mt-1 text-sm text-gray-600">Booking Aktif</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <Link to="/user/my-bookings" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                                Lihat Booking
                                <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <div className="text-xl font-semibold text-gray-900">{stats.completedServices}</div>
                                    <div className="mt-1 text-sm text-gray-600">Layanan Selesai</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <Link to="/user/book-service" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                                Pesan Layanan Baru
                                <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link to="/user/my-cars" className="group">
                        <div className="relative bg-white rounded-lg shadow overflow-hidden group-hover:shadow-md transition-shadow h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                    </div>
                                    <h2 className="ml-4 text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Mobil Saya</h2>
                                </div>
                                <p className="mt-4 text-base text-gray-500">
                                    Kelola kendaraan Anda, tambahkan mobil baru, atau perbarui yang sudah ada.
                                </p>
                                <div className="mt-6 flex items-center text-blue-500 group-hover:text-blue-600 transition-colors">
                                    <span className="font-medium">Lihat Mobil Saya</span>
                                    <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                    
                    <Link to="/user/book-service" className="group">
                        <div className="relative bg-white rounded-lg shadow overflow-hidden group-hover:shadow-md transition-shadow h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h2 className="ml-4 text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Pesan Layanan Baru</h2>
                                </div>
                                <p className="mt-4 text-base text-gray-500">
                                    Jadwalkan janji temu untuk perawatan atau perbaikan kendaraan Anda.
                                </p>
                                <div className="mt-6 flex items-center text-indigo-500 group-hover:text-indigo-600 transition-colors">
                                    <span className="font-medium">Pesan Sekarang</span>
                                    <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                    
                    <Link to="/user/my-bookings" className="group">
                        <div className="relative bg-white rounded-lg shadow overflow-hidden group-hover:shadow-md transition-shadow h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="ml-4 text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">Booking Saya</h2>
                                </div>
                                <p className="mt-4 text-base text-gray-500">
                                    Lihat dan kelola janji temu layanan Anda yang lalu dan yang akan datang.
                                </p>
                                <div className="mt-6 flex items-center text-green-500 group-hover:text-green-600 transition-colors">
                                    <span className="font-medium">Lihat Booking</span>
                                    <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
                            <Link to="/user/my-bookings" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Lihat semua
                            </Link>
                        </div>
                    </div>
                    
                    {loadingActivities ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-3 text-gray-600">Memuat aktivitas terbaru...</p>
                        </div>
                    ) : activityError ? (
                        <div className="p-6 bg-red-50 border-l-4 border-red-500">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{activityError}</p>
                                    <div className="mt-2">
                                        <button onClick={() => window.location.reload()} className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            Coba Lagi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : recentActivities.length === 0 ? (
                        <div className="p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada aktivitas</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai dengan membuat pemesanan layanan baru.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/user/book-service"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Pesan Layanan
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {recentActivities.map(activity => (
                                <div key={activity.bookingId} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={`h-10 w-10 rounded-md flex items-center justify-center ${
                                                activity.status === 'completed' ? 'bg-green-100' :
                                                activity.status === 'confirmed' ? 'bg-blue-100' :
                                                activity.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                                            }`}>
                                                <svg className={`h-6 w-6 ${
                                                    activity.status === 'completed' ? 'text-green-600' :
                                                    activity.status === 'confirmed' ? 'text-blue-600' :
                                                    activity.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {activity.status === 'completed' ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    ) : activity.status === 'confirmed' ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    ) : activity.status === 'pending' ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    )}
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {activity.serviceType?.name || 'Layanan'}
                                                {activity.car && ` untuk ${activity.car.make} ${activity.car.model}`}
                                            </h4>
                                            <div className="mt-1 flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    activity.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {new Date(activity.bookingDate).toLocaleDateString('id-ID', {
                                                        day: 'numeric', 
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-auto">
                                            <Link
                                                to={`/user/my-bookings`}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
