// frontend/src/components/admin/BookingDetails.js
import React from 'react';

const BookingDetails = ({ booking, onClose }) => {
    if (!booking) {
        return null; // This case is handled in the parent component now
    }

    // Status badge classes based on status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'confirmed':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
                {/* Status banner at the top */}
                <div className={`${getStatusBadgeClass(booking.status)} h-2 w-full`}></div>
                
                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`${getStatusBadgeClass(booking.status)} p-2 rounded-full`}>
                            {booking.status === 'pending' && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {booking.status === 'confirmed' && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {booking.status === 'completed' && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {booking.status === 'cancelled' && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-black">
                            <span className="capitalize">{booking.status}</span>
                        </h3>
                    </div>
                    
                    {/* Booking Info */}
                    <div className="space-y-5">
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Booking ID</h4>
                            <p className="text-black font-mono text-sm">{booking.bookingId}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal</h4>
                                <p className="text-black">
                                    {new Date(booking.bookingDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Waktu</h4>
                                <p className="text-black">{booking.bookingTime}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</h4>
                            <p className="text-black font-medium">
                                {booking.user ? booking.user.name : 'N/A'}
                                {booking.user?.username && <span className="text-gray-500 text-sm ml-1">({booking.user.username})</span>}
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kendaraan</h4>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 16v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3m6-10l-4 4m0 0l4 4m-4-4h14" />
                                </svg>
                                <p className="text-black">
                                    {booking.car ? `${booking.car.make} ${booking.car.model}` : 'N/A'}
                                    {booking.car?.licensePlate && (
                                        <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                                            {booking.car.licensePlate}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Layanan</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-black">{booking.serviceType ? booking.serviceType.name : 'N/A'}</p>
                                {booking.serviceType && (
                                    <span className="font-medium text-emerald-600">
                                        Rp{parseFloat(booking.serviceType.price).toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {booking.notes && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Catatan</h4>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-black text-sm">
                                    {booking.notes}
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-5 pt-2">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dibuat</h4>
                                <p className="text-black text-sm">{new Date(booking.createdAt).toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Diperbarui</h4>
                                <p className="text-black text-sm">{new Date(booking.updatedAt).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
