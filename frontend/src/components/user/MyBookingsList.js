// frontend/src/components/user/MyBookingsList.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookingsList = ({ bookings, onCancelBooking }) => {
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
    const [filteredStatus, setFilteredStatus] = useState('all');
    const [animateCards, setAnimateCards] = useState(true);
    const [filteredBookings, setFilteredBookings] = useState(bookings);

    // Filter bookings when status filter changes
    useEffect(() => {
        if (filteredStatus === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(booking => booking.status.toLowerCase() === filteredStatus));
        }
        
        // Trigger animation when filter changes
        setAnimateCards(false);
        setTimeout(() => {
            setAnimateCards(true);
        }, 10);
    }, [filteredStatus, bookings]);

    // Function to determine the status badge styling
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'cancelled':
                return 'bg-rose-100 text-rose-800 border border-rose-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Get background for card header
    const getHeaderBackground = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'from-amber-50 to-amber-100 border-amber-200';
            case 'confirmed':
                return 'from-blue-50 to-blue-100 border-blue-200';
            case 'completed':
                return 'from-emerald-50 to-emerald-100 border-emerald-200';
            case 'cancelled':
                return 'from-rose-50 to-rose-100 border-rose-200';
            default:
                return 'from-gray-50 to-gray-100 border-gray-200';
        }
    };

    // Function to get icon for status
    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'confirmed':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'cancelled':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    // Format date 
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        // If time is already in HH:MM format, return it
        if (timeString.includes(':')) {
            return timeString;
        }
        
        // Otherwise, try to format it
        try {
            const [hours, minutes] = timeString.split(':');
            return `${hours}:${minutes}`;
        } catch (e) {
            return timeString;
        }
    };

    // Toggle expanded booking
    const toggleBookingExpand = (bookingId) => {
        if (expandedBooking === bookingId) {
            setExpandedBooking(null);
        } else {
            setExpandedBooking(bookingId);
        }
    };

    // Handle cancel button click
    const handleCancelClick = (bookingId, e) => {
        e.stopPropagation();
        if (isConfirmingCancel === bookingId) {
            // Confirm cancellation
            onCancelBooking(bookingId);
            setIsConfirmingCancel(null);
        } else {
            // Ask for confirmation
            setIsConfirmingCancel(bookingId);
        }
    };

    // Calculate days left until service
    const calculateDaysLeft = (dateString) => {
        const bookingDate = new Date(dateString);
        const today = new Date();
        const diffTime = bookingDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get status counts
    const getStatusCount = (status) => {
        return bookings.filter(booking => 
            status === 'all' ? true : booking.status.toLowerCase() === status
        ).length;
    };

    if (bookings.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-lg p-8"
            >
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
                        <div className="relative rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-5 shadow-md">
                            <svg className="h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Belum Ada Pemesanan Layanan</h3>
                    <p className="text-gray-600 max-w-md">
                        Anda belum memiliki jadwal layanan untuk kendaraan Anda. Jadwalkan perawatan rutin atau perbaikan kendaraan Anda sekarang untuk menjaga kinerja optimal.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href='/user/book-service'}
                        className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Buat Pemesanan Baru
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    // Container variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Item variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            {/* Filter and View Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold text-gray-900">Booking Saya</h2>
                        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {bookings.length}
                        </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {/* Filter Status */}
                        <div className="relative">
                            <select
                                value={filteredStatus}
                                onChange={(e) => setFilteredStatus(e.target.value)}
                                className="pl-3 pr-10 py-2 text-sm bg-white text-black border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            >
                                <option value="all">Semua Status ({bookings.length})</option>
                                <option value="pending">Pending ({getStatusCount('pending')})</option>
                                <option value="confirmed">Dikonfirmasi ({getStatusCount('confirmed')})</option>
                                <option value="completed">Selesai ({getStatusCount('completed')})</option>
                                <option value="cancelled">Dibatalkan ({getStatusCount('cancelled')})</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="bg-gray-100 flex p-0.5 rounded-md shadow-sm">
                            <button
                                className={`flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md ${viewMode === 'cards' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setViewMode('cards')}
                            >
                                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 002-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 002-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Kartu
                            </button>
                            <button
                                className={`flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md ${viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Daftar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' && (
                <AnimatePresence>
                    {animateCards && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {filteredBookings.map((booking) => (
                                <motion.div
                                    key={booking.bookingId}
                                    variants={itemVariants}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => toggleBookingExpand(booking.bookingId)}
                                >
                                    {/* Card Header */}
                                    <div className={`bg-gradient-to-r ${getHeaderBackground(booking.status)} px-4 py-3 flex justify-between items-center border-b`}>
                                        <div className="flex items-center space-x-2">
                                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                                            </span>
                                            
                                            {/* Show days counter for upcoming bookings */}
                                            {(booking.status === 'pending' || booking.status === 'confirmed') && 
                                             calculateDaysLeft(booking.bookingDate) >= 0 && (
                                                <span className="text-xs bg-white bg-opacity-80 text-gray-800 rounded-full px-2 py-0.5 shadow-sm">
                                                    {calculateDaysLeft(booking.bookingDate) === 0 ? (
                                                        <span className="text-rose-600 font-medium">Hari ini</span>
                                                    ) : (
                                                        <>
                                                            {calculateDaysLeft(booking.bookingDate)} hari lagi
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center text-gray-400">
                                            {expandedBooking === booking.bookingId ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Card Content */}
                                    <div className="p-4">
                                        {/* Service Details */}
                                        <div className="flex items-start mb-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className={`h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center`}>
                                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4m1 5l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                                    {booking.serviceType?.name || 'Layanan Tidak Tersedia'}
                                                </h3>
                                                {booking.serviceType?.price && (
                                                    <p className="mt-1 text-blue-600 font-medium inline-flex items-center">
                                                        <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Rp{parseFloat(booking.serviceType.price).toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Schedule & Car Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-xs text-gray-500 mb-1">Jadwal</div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{formatDate(booking.bookingDate).split(',')[0]}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatTime(booking.bookingTime)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-xs text-gray-500 mb-1">Kendaraan</div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                    </svg>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.car ? `${booking.car.make} ${booking.car.model}` : 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {booking.car?.licensePlate || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedBooking === booking.bookingId && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    {/* Notes */}
                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-700 mb-1">Catatan</div>
                                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                                                            {booking.notes || 'Tidak ada catatan tambahan'}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Full Date */}
                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-700 mb-1">Detail Jadwal</div>
                                                        <div className="text-sm text-gray-900">
                                                            {formatDate(booking.bookingDate)}, {formatTime(booking.bookingTime)}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Booking ID */}
                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-700 mb-1">ID Booking</div>
                                                        <div className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 text-gray-900">
                                                            #{booking.bookingId}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Actions */}
                                        {booking.status === 'pending' && (
                                            <div className="mt-4">
                                                {isConfirmingCancel === booking.bookingId ? (
                                                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                                                        <p className="text-sm text-rose-800 mb-2 font-medium">Batalkan pemesanan ini?</p>
                                                        <div className="flex space-x-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsConfirmingCancel(null);
                                                                }}
                                                                className="flex-1 py-1.5 px-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                            >
                                                                Tidak
                                                            </button>
                                                            <button
                                                                onClick={(e) => onCancelBooking(booking.bookingId)}
                                                                className="flex-1 py-1.5 px-3 bg-rose-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                                            >
                                                                Ya, Batalkan
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleCancelClick(booking.bookingId, e)}
                                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-rose-300 text-sm font-medium rounded-md text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Batalkan Pemesanan
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal & Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Kendaraan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Layanan & Harga
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                    Catatan
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {animateCards && filteredBookings.map((booking, index) => (
                                    <motion.tr 
                                        key={booking.bookingId} 
                                        className={`hover:bg-blue-50 transition-all cursor-pointer ${expandedBooking === booking.bookingId ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleBookingExpand(booking.bookingId)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatDate(booking.bookingDate).split(',')[0]}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <svg className="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTime(booking.bookingTime)}
                                            </div>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {booking.car ? `${booking.car.make} ${booking.car.model}` : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {booking.car?.licensePlate || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {booking.serviceType?.name || 'N/A'}
                                            </div>
                                            {booking.serviceType?.price && (
                                                <div className="text-sm text-blue-600 font-medium mt-1">
                                                    Rp{parseFloat(booking.serviceType.price).toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="text-sm text-gray-900 max-w-xs line-clamp-2">
                                                {booking.notes || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            {booking.status === 'pending' && (
                                                isConfirmingCancel === booking.bookingId ? (
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsConfirmingCancel(null);
                                                            }}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onCancelBooking(booking.bookingId);
                                                            }}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-rose-600 hover:bg-rose-700"
                                                        >
                                                            Ya
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleCancelClick(booking.bookingId, e)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 focus:outline-none transition-colors"
                                                    >
                                                        <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Batalkan
                                                    </button>
                                                )
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <span className="inline-flex items-center px-3 py-1.5 text-xs text-blue-700 bg-blue-100 rounded-md">
                                                    <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Terkonfirmasi
                                                </span>
                                            )}
                                            {booking.status === 'completed' && (
                                                <span className="inline-flex items-center px-3 py-1.5 text-xs text-emerald-700 bg-emerald-100 rounded-md">
                                                    <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Selesai
                                                </span>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <span className="inline-flex items-center px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-md">
                                                    <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Dibatalkan
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    
                    {/* No results message */}
                    {filteredBookings.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="bg-gray-100 rounded-full p-3 mb-3">
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-center">
                                Tidak ada pemesanan dengan status "{filteredStatus}"
                            </p>
                            <button 
                                onClick={() => setFilteredStatus('all')}
                                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Tampilkan semua pemesanan
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBookingsList;
