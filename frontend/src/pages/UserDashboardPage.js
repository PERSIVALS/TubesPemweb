// frontend/src/pages/UserDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axiosClient from '../api/axiosClient'; // Import axiosClient untuk fetch data
import RecentActivityCard from '../components/user/RecentActivityCard'; // Import komponen baru

const UserDashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [activityError, setActivityError] = useState('');

    useEffect(() => {
        const fetchRecentActivities = async () => {
            if (!user) { // Pastikan user sudah ada (login)
                setLoadingActivities(false);
                return;
            }
            try {
                setLoadingActivities(true);
                setActivityError('');
                const response = await axiosClient.get('/bookings/recent'); // Panggil endpoint baru
                setRecentActivities(response.data);
            } catch (err) {
                console.error('Gagal mengambil aktivitas terbaru:', err);
                setActivityError(err.response?.data?.message || 'Gagal memuat aktivitas terbaru.');
            } finally {
                setLoadingActivities(false);
            }
        };

        fetchRecentActivities();
    }, [user]); // Re-fetch jika user berubah (misal setelah login)

    if (authLoading) {
        return <LoadingSpinner message="Memuat dashboard pengguna..." />;
    }

    if (!user) {
        // Redireksi akan ditangani oleh DashboardLayout di App.js
        return null;
    }

    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">Selamat Datang, {user.name || user.username}!</h1>

            {/* Dashboard Cards (My Cars, Book New Service, My Bookings) */}
            <div className="columns is-multiline">
                <div className="column is-4">
                    <div className="card has-background-dark-lighter has-text-light p-4">
                        <h2 className="title is-5 has-text-light">Mobil Saya</h2>
                        <p className="subtitle is-6 has-text-grey-light">Kelola kendaraan Anda yang terdaftar.</p>
                        <Link to="/user/my-cars" className="button is-primary is-small">
                            Lihat Mobil Saya
                        </Link>
                    </div>
                </div>
                <div className="column is-4">
                    <div className="card has-background-dark-lighter has-text-light p-4">
                        <h2 className="title is-5 has-text-light">Pesan Layanan Baru</h2>
                        <p className="subtitle is-6 has-text-grey-light">Jadwalkan janji temu perawatan atau perbaikan.</p>
                        <Link to="/user/book-service" className="button is-primary is-small">
                            Pesan Sekarang
                        </Link>
                    </div>
                </div>
                <div className="column is-4">
                    <div className="card has-background-dark-lighter has-text-light p-4">
                        <h2 className="title is-5 has-text-light">Booking Saya</h2>
                        <p className="subtitle is-6 has-text-grey-light">Lihat janji temu layanan Anda yang lalu dan yang akan datang.</p>
                        <Link to="/user/my-bookings" className="button is-primary is-small">
                            Lihat Booking
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            {loadingActivities ? (
                <LoadingSpinner message="Memuat aktivitas terbaru..." />
            ) : activityError ? (
                <div className="box has-background-dark p-5 mt-5">
                    <div className="notification is-danger is-light">
                        <p>{activityError}</p>
                        <button className="button is-small is-light mt-2" onClick={() => window.location.reload()}>Coba Lagi</button>
                    </div>
                </div>
            ) : (
                <RecentActivityCard activities={recentActivities} />
            )}
        </div>
    );
};

export default UserDashboardPage;
