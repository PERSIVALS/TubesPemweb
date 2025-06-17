// frontend/src/components/admin/BookingList.js
import React from 'react';

const BookingList = ({ bookings, onStatusUpdate, onDelete, onViewDetails }) => {
    // Status options for dropdown
    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
        { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
        { value: 'completed', label: 'Completed', color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
    ];

    // Helper function to get status color
    const getStatusColor = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.color : 'bg-gray-500';
    };

    if (bookings.length === 0) {
        return null; // Empty state is handled in the parent component
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <tr 
                            key={booking.bookingId} 
                            onClick={() => onViewDetails(booking)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <div className="text-sm font-medium text-black">
                                        {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-500">{booking.bookingTime}</div>
                                    <div className="text-xs text-gray-400 font-mono mt-1">
                                        {booking.bookingId.substring(0, 8)}...
                                    </div>
                                </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <div className="text-sm font-medium text-black">
                                        {booking.user ? booking.user.name : 'N/A'}
                                    </div>
                                    {booking.car && (
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 16v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3m6-10l-4 4m0 0l4 4m-4-4h14" />
                                            </svg>
                                            {`${booking.car.make} (${booking.car.licensePlate})`}
                                        </div>
                                    )}
                                </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-black">
                                    {booking.serviceType ? booking.serviceType.name : 'N/A'}
                                </div>
                                {booking.serviceType && (
                                    <div className="text-xs text-emerald-600 font-medium">
                                        Rp{parseFloat(booking.serviceType.price).toLocaleString('id-ID')}
                                    </div>
                                )}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            onStatusUpdate(booking.bookingId, e.target.value);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-white text-sm font-medium ${getStatusColor(booking.status)} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer`}
                                    >
                                        {statusOptions.map(option => (
                                            <option 
                                                key={option.value} 
                                                value={option.value}
                                                className="bg-gray-800 text-white"
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetails(booking);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                        title="View details"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(booking.bookingId);
                                        }}
                                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                                        title="Delete booking"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingList;
