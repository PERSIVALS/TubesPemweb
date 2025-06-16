// frontend/src/pages/admin/ManageBookingsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient'; // Menggunakan axiosClient yang sudah dikonfigurasi
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Import LoadingSpinner
import BookingList from '../../components/admin/BookingList';
import BookingDetails from '../../components/admin/BookingDetails';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusOptions = [
        { value: 'all', label: 'All Bookings' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    // Fungsi untuk mengambil daftar pemesanan dari backend
    // Dibungkus dengan useCallback untuk stabilitas di useEffect
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosClient.get('/bookings');
            setBookings(response.data);
            // Langsung perbarui filteredBookings setelah fetch
            if (filterStatus === 'all') {
                setFilteredBookings(response.data);
            } else {
                setFilteredBookings(response.data.filter(booking => booking.status === filterStatus));
            }
        } catch (err) {
            console.error('Gagal mengambil daftar pemesanan:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal memuat daftar pemesanan.');
        } finally {
            setLoading(false);
        }
    }, [filterStatus]); // filterStatus sebagai dependensi untuk fetchBookings

    // Memfilter bookings berdasarkan status yang dipilih
    // Dibungkus dengan useCallback agar tidak dibuat ulang di setiap render
    const filterBookings = useCallback(() => {
        if (filterStatus === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(booking => booking.status === filterStatus));
        }
    }, [filterStatus, bookings]); // bookings dan filterStatus sebagai dependensi

    // Fetch bookings saat komponen dimuat (hanya sekali)
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]); // fetchBookings sekarang menjadi dependensi karena useCallback

    // Filter bookings saat filterStatus atau data bookings berubah
    useEffect(() => {
        filterBookings();
    }, [filterBookings]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosClient.put(`/bookings/${bookingId}`, { status: newStatus });
            setBookings(prevBookings => prevBookings.map(booking =>
                booking.bookingId === bookingId ? response.data : booking
            ));
            if (selectedBooking?.bookingId === bookingId) {
                setSelectedBooking(response.data);
            }
        } catch (err) {
            console.error('Gagal memperbarui status pemesanan:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal memperbarui status pemesanan.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pemesanan ini?')) {
            try {
                setLoading(true);
                setError(null);
                await axiosClient.delete(`/bookings/${bookingId}`);
                setBookings(prevBookings => prevBookings.filter(booking => booking.bookingId !== bookingId));
                if (selectedBooking?.bookingId === bookingId) {
                    setSelectedBooking(null);
                }
            } catch (err) {
                console.error('Gagal menghapus pemesanan:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Gagal menghapus pemesanan.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <LoadingSpinner message="Memuat daftar pemesanan..." />;
    }

    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-primary mb-4 has-text-weight-bold">Kelola Pemesanan</h1>
            
            {error && (
                <div className="notification is-danger is-light mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="box has-background-dark p-5 mb-6 is-rounded-lg has-shadow-md">
                <div className="field">
                    <label className="label has-text-light">Filter berdasarkan Status:</label>
                    <div className="control">
                        <div className="select is-medium is-dark is-fullwidth">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns is-multiline">
                <div className="column is-two-thirds">
                    <div className="box has-background-dark p-5 is-rounded-lg has-shadow-md">
                        <h2 className="title is-4 has-text-light mb-4">Daftar Pemesanan</h2>
                        <BookingList
                            bookings={filteredBookings}
                            onStatusUpdate={handleStatusUpdate}
                            onDelete={handleDeleteBooking}
                            onViewDetails={(booking) => setSelectedBooking(booking)}
                        />
                    </div>
                </div>
                <div className="column is-one-third">
                    {selectedBooking && (
                        <div className="box has-background-dark p-5 is-rounded-lg has-shadow-md">
                            <h2 className="title is-4 has-text-light mb-4">Detail Pemesanan</h2>
                            <BookingDetails
                                booking={selectedBooking}
                                onClose={() => setSelectedBooking(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBookingsPage;
