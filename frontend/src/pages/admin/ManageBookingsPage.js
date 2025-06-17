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
    const [isRefreshing, setIsRefreshing] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'All Bookings', color: 'bg-gray-500' },
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
        { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
        { value: 'completed', label: 'Completed', color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
    ];

    // Fungsi untuk mengambil daftar pemesanan dari backend
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosClient.get('/bookings');
            setBookings(response.data);
            
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
            setIsRefreshing(false);
        }
    }, [filterStatus]);

    // Memfilter bookings berdasarkan status yang dipilih
    const filterBookings = useCallback(() => {
        if (filterStatus === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(booking => booking.status === filterStatus));
        }
    }, [filterStatus, bookings]);

    // Fetch bookings saat komponen dimuat
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Filter bookings saat filterStatus atau data bookings berubah
    useEffect(() => {
        filterBookings();
    }, [filterBookings]);

    const refreshData = () => {
        setIsRefreshing(true);
        fetchBookings();
    };

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

    if (loading && bookings.length === 0) {
        return <LoadingSpinner message="Memuat daftar pemesanan..." />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto">
                {/* Header with animation */}
                <div className="relative mb-8">
                    <h1 className="text-4xl font-extrabold text-black mb-2 transition-all duration-300 ease-in-out transform hover:scale-105">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Kelola Pemesanan
                        </span>
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                </div>
                
                {/* Error notification */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md animate-fadeIn">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Status filter and refresh button */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl shadow-md w-full md:w-2/3 transition-all duration-300 hover:shadow-lg">
                        <div className="mb-2">
                            <label className="block text-gray-700 font-medium mb-2">Filter berdasarkan Status:</label>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="block appearance-none w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-gray-800">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className={`flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg ${isRefreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        <svg 
                            className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {isRefreshing ? 'Memuat...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Statistics cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {statusOptions.filter(option => option.value !== 'all').map(status => {
                        const count = bookings.filter(booking => booking.status === status.value).length;
                        return (
                            <div 
                                key={status.value}
                                className={`${status.color} bg-opacity-10 border-l-4 ${status.color} rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer`}
                                onClick={() => setFilterStatus(status.value)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm uppercase font-semibold text-black">{status.label}</p>
                                        <p className="text-3xl font-bold text-black">{count}</p>
                                    </div>
                                    <div className={`${status.color} rounded-full p-2 text-white`}>
                                        {status.value === 'pending' && (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {status.value === 'confirmed' && (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {status.value === 'completed' && (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {status.value === 'cancelled' && (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main content area */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Booking list */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-black flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Daftar Pemesanan
                                </h2>
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {filteredBookings.length} item
                                </span>
                            </div>
                            
                            {loading && bookings.length > 0 && (
                                <div className="flex justify-center my-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            
                            {!loading && filteredBookings.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="mt-4 text-lg font-medium text-gray-500">Tidak ada pemesanan ditemukan</p>
                                    <p className="mt-2 text-sm text-gray-500">Coba filter status lainnya atau refresh data</p>
                                </div>
                            ) : (
                                <BookingList
                                    bookings={filteredBookings}
                                    onStatusUpdate={handleStatusUpdate}
                                    onDelete={handleDeleteBooking}
                                    onViewDetails={(booking) => setSelectedBooking(booking)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Booking details */}
                    <div className="w-full lg:w-1/3">
                        {selectedBooking ? (
                            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-fadeIn">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-black flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Detail Pemesanan
                                    </h2>
                                    <button 
                                        onClick={() => setSelectedBooking(null)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <BookingDetails
                                    booking={selectedBooking}
                                    onClose={() => setSelectedBooking(null)}
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center h-64">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-4 text-lg font-medium text-gray-500">Pilih pemesanan</p>
                                <p className="mt-2 text-sm text-gray-400 text-center">Klik pada salah satu pemesanan untuk melihat detailnya</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBookingsPage;
