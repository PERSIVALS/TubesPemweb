import React from 'react';

const BookingList = ({ bookings, onStatusUpdate, onDelete, onViewDetails }) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date/Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(booking.appointmentDate).toLocaleDateString()}<br/>
                                {booking.appointmentTime}
                            </td>
                            <td className="px-6 py-4">
                                {booking.user.name}<br/>
                                <span className="text-sm text-gray-500">{booking.user.email}</span>
                            </td>
                            <td className="px-6 py-4">
                                {booking.serviceType.name}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onViewDetails(booking)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                    Details
                                </button>
                                <select
                                    value={booking.status}
                                    onChange={(e) => onStatusUpdate(booking.bookingId, e.target.value)}
                                    className="mr-3 text-sm border rounded"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                    onClick={() => onDelete(booking.bookingId)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingList;