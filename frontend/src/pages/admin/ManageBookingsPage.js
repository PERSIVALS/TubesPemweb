// frontend/src/pages/admin/ManageBookingsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axiosConfig';
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

    const filterBookings = useCallback(() => {
        if (filterStatus === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(booking => booking.status === filterStatus));
        }
    }, [filterStatus, bookings]);

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [filterBookings]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings');
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch bookings');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await axios.put(`/api/bookings/${bookingId}/status`, {
                status: newStatus
            });
            setBookings(bookings.map(booking =>
                booking.bookingId === bookingId ? response.data : booking
            ));
        } catch (err) {
            setError('Failed to update booking status');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`/api/bookings/${bookingId}`);
                setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
                if (selectedBooking?.bookingId === bookingId) {
                    setSelectedBooking(null);
                }
            } catch (err) {
                setError('Failed to delete booking');
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                </label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BookingList
                        bookings={filteredBookings}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDeleteBooking}
                        onViewDetails={(booking) => setSelectedBooking(booking)}
                    />
                </div>
                <div className="lg:col-span-1">
                    {selectedBooking && (
                        <BookingDetails
                            booking={selectedBooking}
                            onClose={() => setSelectedBooking(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBookingsPage;