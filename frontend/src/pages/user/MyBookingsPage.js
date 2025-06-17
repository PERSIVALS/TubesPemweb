import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Ensure this path is correct
import { useAuth } from '../../context/AuthContext'; // To ensure user is authenticated
import MyBookingsList from '../../components/user/MyBookingsList'; // Import the new table component

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Pembatalan</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-2">
                    <p className="text-sm text-gray-700">{message}</p>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Ya, Batalkan'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const MyBookingsPage = () => {
    const { user } = useAuth(); // Assume useAuth provides user object when authenticated
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false); // State for cancellation loading

    // Function to fetch user's bookings from the backend
    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            // Endpoint to get all user bookings (filtered by token in the backend)
            const response = await axiosClient.get('/bookings');
            setBookings(response.data);
        } catch (err) {
            console.error('Failed to retrieve bookings list:', err);
            setError(err.response?.data?.message || 'Failed to load bookings list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle opening the cancellation confirmation modal
    const handleOpenCancelModal = (bookingId) => {
        setBookingToCancelId(bookingId);
        setIsModalOpen(true);
    };

    // Function to handle closing the cancellation confirmation modal
    const handleCloseCancelModal = () => {
        setIsModalOpen(false);
        setBookingToCancelId(null);
    };

    // Function to confirm and cancel a booking
    const handleConfirmCancelBooking = async () => {
        if (!bookingToCancelId) return;

        setIsCancelling(true);
        setError(''); // Clear previous errors
        try {
            // Send PUT request to change booking status to 'cancelled'
            await axiosClient.put(`/bookings/${bookingToCancelId}`, { status: 'cancelled' });
            // After successful cancellation, refresh the bookings list
            await fetchBookings();
            handleCloseCancelModal(); // Close the modal on success
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            setError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
        } finally {
            setIsCancelling(false);
        }
    };

    // Run fetchBookings when component mounts or user changes
    useEffect(() => {
        // Only fetch if user is authenticated (assuming `user` is null initially and then populated)
        // and Firebase is initialized. This avoids trying to fetch before auth is ready.
        if (user) {
            fetchBookings();
        } else {
            // If user is null (e.g., still authenticating or not logged in), don't show infinite spinner
            setLoading(false);
        }
    }, [user]); // Dependency on user ensures re-fetch if user state changes

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <LoadingSpinner message="Memuat daftar pemesanan Anda..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-lg w-full text-center" role="alert">
                    <p className="font-bold mb-2">Terjadi Kesalahan!</p>
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={fetchBookings}
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-8 lg:p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                <div className="p-6 sm:p-8 bg-blue-700 text-white rounded-t-2xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Pemesanan Saya</h1>
                    <p className="text-blue-200 text-lg sm:text-xl">
                        Halaman ini menampilkan riwayat layanan dan janji temu Anda.
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                            <svg className="mx-auto h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Pemesanan Ditemukan</h3>
                            <p className="text-gray-500">Sepertinya Anda belum memiliki layanan atau janji temu yang dijadwalkan.</p>
                            {/* You might add a link/button to book a service here */}
                            <button
                                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                // onClick={() => navigate('/book-service')} // Example: if you have a navigation
                            >
                                Jadwalkan Layanan Sekarang
                            </button>
                        </div>
                    ) : (
                        <MyBookingsList bookings={bookings} onCancelBooking={handleOpenCancelModal} />
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                message="Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat diurungkan."
                onConfirm={handleConfirmCancelBooking}
                onCancel={handleCloseCancelModal}
                isLoading={isCancelling}
            />
        </div>
    );
};

export default MyBookingsPage;