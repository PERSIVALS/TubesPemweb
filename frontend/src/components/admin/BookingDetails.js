import React from 'react';

const BookingDetails = ({ booking, onClose }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                    <p className="mt-1">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">{booking.user.email}</p>
                    <p className="text-sm text-gray-500">{booking.user.phone}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Vehicle Information</h3>
                    <p className="mt-1">
                        {booking.car.make} {booking.car.model} ({booking.car.year})
                    </p>
                    <p className="text-sm text-gray-500">License: {booking.car.licensePlate}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Service Details</h3>
                    <p className="mt-1">{booking.serviceType.name}</p>
                    <p className="text-sm text-gray-500">${booking.serviceType.price}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Appointment</h3>
                    <p className="mt-1">
                        {new Date(booking.appointmentDate).toLocaleDateString()}<br/>
                        {booking.appointmentTime}
                    </p>
                </div>

                {booking.notes && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                        <p className="mt-1 text-sm text-gray-600">{booking.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;