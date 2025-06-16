// frontend/src/components/user/MyBookingsList.js
import React from 'react';

const MyBookingsList = ({ bookings, onCancelBooking }) => {
    // Tampilkan pesan jika tidak ada pemesanan
    if (bookings.length === 0) {
        return (
            <div className="notification is-info is-light">
                Anda belum memiliki pemesanan layanan. Ayo pesan sekarang!
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable has-background-dark has-text-light">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Mobil</th>
                        <th>Jenis Layanan</th>
                        <th>Harga</th>
                        <th>Catatan</th>
                        <th>Status</th>
                        <th className="has-text-centered">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td className="has-text-light">
                                {/* Format tanggal agar lebih mudah dibaca */}
                                {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </td>
                            <td className="has-text-light">{booking.bookingTime}</td>
                            <td className="has-text-light">
                                {/* Tampilkan detail mobil jika ada */}
                                {booking.car ? `${booking.car.make} ${booking.car.model} (${booking.car.licensePlate})` : 'N/A'}
                            </td>
                            <td className="has-text-light">
                                {/* Tampilkan nama layanan jika ada */}
                                {booking.serviceType ? booking.serviceType.name : 'N/A'}
                            </td>
                            <td className="has-text-light">
                                {/* Tampilkan harga layanan jika ada, format sebagai mata uang Rupiah */}
                                {booking.serviceType ? `Rp${parseFloat(booking.serviceType.price).toLocaleString('id-ID')}` : 'N/A'}
                            </td>
                            <td className="has-text-light">{booking.notes || '-'}</td> {/* Tampilkan '-' jika catatan kosong */}
                            <td>
                                {/* Tampilkan status dengan tag Bulma yang sesuai */}
                                <span className={`tag ${
                                    booking.status === 'pending' ? 'is-warning' :
                                    booking.status === 'confirmed' ? 'is-info' :
                                    booking.status === 'completed' ? 'is-success' :
                                    'is-danger'
                                }`}>
                                    {/* Uppercase huruf pertama status */}
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </td>
                            <td className="has-text-centered">
                                {/* Tombol "Batalkan" hanya jika statusnya 'pending' */}
                                {booking.status === 'pending' && (
                                    <button
                                        className="button is-danger is-small"
                                        onClick={() => onCancelBooking(booking.bookingId)}
                                    >
                                        Batalkan
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyBookingsList;
