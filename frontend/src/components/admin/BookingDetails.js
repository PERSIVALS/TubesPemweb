// frontend/src/components/admin/BookingDetails.js
import React from 'react';

const BookingDetails = ({ booking, onClose }) => {
    if (!booking) {
        return (
            <div className="notification is-warning is-light has-text-centered p-5 is-rounded-lg">
                <p className="title is-5 has-text-warning">Pilih pemesanan untuk melihat detail.</p>
            </div>
        );
    }

    return (
        <div className="card has-background-dark-lighter has-text-light is-rounded-lg has-shadow-md">
            <div className="card-content">
                <p className="title is-5 has-text-light mb-4">Detail Pemesanan</p>
                <button className="delete is-pulled-right" aria-label="close" onClick={onClose}></button>
                
                <div className="content">
                    <p><strong>ID:</strong> <span className="has-text-grey-light">{booking.bookingId}</span></p>
                    <p>
                        <strong>Tanggal & Waktu:</strong> <span className="has-text-grey-light">
                            {new Date(booking.bookingDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            {' '}pukul {booking.bookingTime}
                        </span>
                    </p>
                    <p>
                        <strong>User:</strong> <span className="has-text-grey-light">
                            {booking.user ? `${booking.user.name} (${booking.user.username})` : 'N/A'}
                        </span>
                    </p>
                    <p>
                        <strong>Mobil:</strong> <span className="has-text-grey-light">
                            {booking.car ? `${booking.car.make} ${booking.car.model} (${booking.car.licensePlate})` : 'N/A'}
                        </span>
                    </p>
                    <p>
                        <strong>Jenis Layanan:</strong> <span className="has-text-grey-light">
                            {booking.serviceType ? `${booking.serviceType.name} (Rp${parseFloat(booking.serviceType.price).toLocaleString('id-ID')})` : 'N/A'}
                        </span>
                    </p>
                    <p><strong>Catatan:</strong> <span className="has-text-grey-light">{booking.notes || '-'}</span></p>
                    <p>
                        <strong>Status:</strong>{' '}
                        <span className={`tag ${
                            booking.status === 'pending' ? 'is-warning is-light' :
                            booking.status === 'confirmed' ? 'is-info' :
                            booking.status === 'completed' ? 'is-success' :
                            'is-danger'
                        } is-medium`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </p>
                    <p><strong>Dibuat Pada:</strong> <span className="has-text-grey-light">{new Date(booking.createdAt).toLocaleString('id-ID')}</span></p>
                    <p><strong>Terakhir Diperbarui:</strong> <span className="has-text-grey-light">{new Date(booking.updatedAt).toLocaleString('id-ID')}</span></p>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
