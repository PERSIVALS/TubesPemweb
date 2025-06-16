// frontend/src/components/admin/BookingList.js
import React from 'react';

const BookingList = ({ bookings, onStatusUpdate, onDelete, onViewDetails }) => {
    if (bookings.length === 0) {
        return (
            <div className="notification is-info is-light has-text-centered p-5 is-rounded-lg">
                <p className="title is-4 has-text-info">
                    <span className="icon is-large mb-2">
                        <i className="fas fa-calendar-alt"></i>
                    </span>
                    <br />
                    Tidak ada pemesanan yang ditemukan.
                </p>
                <p className="subtitle is-6 has-text-info-dark mt-3">
                    Coba ubah filter status atau tambahkan pemesanan baru.
                </p>
            </div>
        );
    }

    // Opsi status untuk dropdown di tabel
    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable has-background-dark has-text-light">
                <thead>
                    <tr>
                        <th>ID Booking</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>User</th>
                        <th>Mobil</th>
                        <th>Layanan</th>
                        <th>Status</th>
                        <th className="has-text-centered">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td className="has-text-light is-vcentered is-size-7">{booking.bookingId.substring(0, 8)}...</td> {/* Tampilkan sebagian ID */}
                            <td className="has-text-light is-vcentered">
                                {new Date(booking.bookingDate).toLocaleDateString('id-ID')}
                            </td>
                            <td className="has-text-light is-vcentered">{booking.bookingTime}</td>
                            <td className="has-text-light is-vcentered">
                                {/* Asumsi booking memiliki relasi user yang dimuat (e.g., include: User di controller) */}
                                {booking.user ? booking.user.username : 'N/A'}
                            </td>
                            <td className="has-text-light is-vcentered">
                                {/* Asumsi booking memiliki relasi car yang dimuat */}
                                {booking.car ? `${booking.car.make} (${booking.car.licensePlate})` : 'N/A'}
                            </td>
                            <td className="has-text-light is-vcentered">
                                {/* Asumsi booking memiliki relasi serviceType yang dimuat */}
                                {booking.serviceType ? booking.serviceType.name : 'N/A'}
                            </td>
                            <td className="is-vcentered">
                                {/* Dropdown untuk mengubah status */}
                                <div className="select is-small is-dark">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => onStatusUpdate(booking.bookingId, e.target.value)}
                                        className={`has-background-${
                                            booking.status === 'pending' ? 'warning' :
                                            booking.status === 'confirmed' ? 'info' :
                                            booking.status === 'completed' ? 'success' :
                                            'danger'
                                        }`}
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                            <td className="has-text-centered is-vcentered is-nowrap">
                                {/* Tombol Detail */}
                                <button
                                    className="button is-primary is-small is-rounded mr-2 has-shadow-sm"
                                    onClick={() => onViewDetails(booking)}
                                >
                                    <span className="icon is-small">
                                        <i className="fas fa-eye"></i>
                                    </span>
                                    <span>Detail</span>
                                </button>
                                {/* Tombol Delete */}
                                <button
                                    className="button is-danger is-small is-rounded has-shadow-sm"
                                    onClick={() => onDelete(booking.bookingId)}
                                >
                                    <span className="icon is-small">
                                        <i className="fas fa-trash-alt"></i>
                                    </span>
                                    <span>Hapus</span>
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
