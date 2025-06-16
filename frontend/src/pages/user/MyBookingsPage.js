// frontend/src/pages/user/MyBookingsPage.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Pastikan path ini benar
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Pastikan path ini benar
import { useAuth } from '../../context/AuthContext'; // Untuk memastikan user terautentikasi
import MyBookingsList from '../../components/user/MyBookingsList'; // Import komponen tabel baru

const MyBookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fungsi untuk mengambil daftar pemesanan milik user dari backend
    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            // Endpoint untuk mengambil semua booking user (difilter di backend berdasarkan token)
            const response = await axiosClient.get('/bookings');
            setBookings(response.data);
        } catch (err) {
            console.error('Gagal mengambil daftar pemesanan:', err);
            setError(err.response?.data?.message || 'Gagal memuat daftar pemesanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk membatalkan pemesanan
    const handleCancelBooking = async (bookingId) => {
        // Menggunakan window.confirm untuk konfirmasi (bisa diganti modal kustom)
        if (window.confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
            try {
                setLoading(true);
                // Mengirim PUT request untuk mengubah status booking menjadi 'cancelled'
                await axiosClient.put(`/bookings/${bookingId}`, { status: 'cancelled' });
                // Setelah berhasil dibatalkan, refresh daftar pemesanan
                await fetchBookings();
            } catch (err) {
                console.error('Gagal membatalkan pemesanan:', err);
                setError(err.response?.data?.message || 'Gagal membatalkan pemesanan. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Jalankan fetchBookings saat komponen dimuat atau saat user berubah
    useEffect(() => {
        if (user) { // Pastikan user sudah ada sebelum mencoba fetch bookings
            fetchBookings();
        } else {
            setLoading(false); // Jika user belum ada (misal masih loading auth), jangan tampilkan spinner terus
        }
    }, [user]); // Dependensi pada user memastikan re-fetch jika user state berubah

    if (loading) {
        return <LoadingSpinner message="Memuat daftar pemesanan Anda..." />;
    }

    if (error) {
        return (
            <section className="hero is-fullheight has-background-dark has-text-light is-flex is-justify-content-center is-align-items-center">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <p className="subtitle is-4 has-text-danger-light">{error}</p>
                        <button className="button is-primary is-small mt-3" onClick={fetchBookings}>Coba Lagi</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">Pemesanan Saya</h1>
            <div className="box has-background-dark p-5">
                <p className="subtitle is-5 has-text-grey-light mb-5">
                    Halaman ini menampilkan riwayat layanan dan janji temu Anda.
                </p>

                {/* Komponen MyBookingsList untuk menampilkan tabel */}
                <MyBookingsList bookings={bookings} onCancelBooking={handleCancelBooking} />

            </div>
        </div>
    );
};

export default MyBookingsPage;
