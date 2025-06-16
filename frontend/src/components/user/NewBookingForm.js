// frontend/src/components/user/NewBookingForm.js
import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient'; // Pastikan path ini benar
import LoadingSpinner from '../common/LoadingSpinner'; // Pastikan path ini benar
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah booking berhasil

const NewBookingForm = ({ cars, serviceTypes }) => {
    const navigate = useNavigate();
    const [selectedCarId, setSelectedCarId] = useState('');
    const [selectedServiceTypeId, setSelectedServiceTypeId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validasi dasar
        if (!selectedCarId || !selectedServiceTypeId || !bookingDate || !bookingTime) {
            setError('Mohon lengkapi semua bidang yang wajib.');
            setLoading(false);
            return;
        }

        const bookingData = {
            carId: selectedCarId,
            serviceTypeId: selectedServiceTypeId,
            bookingDate, // Kirim tanggal dalam format YYYY-MM-DD
            bookingTime, // Kirim waktu dalam format HH:MM
            notes,
        };

        try {
            await axiosClient.post('/bookings', bookingData);
            setSuccess('Pemesanan berhasil dibuat! Anda akan dialihkan ke halaman booking Anda.');
            // Reset form
            setSelectedCarId('');
            setSelectedServiceTypeId('');
            setBookingDate('');
            setBookingTime('');
            setNotes('');
            
            // Redirect ke halaman My Bookings setelah beberapa detik
            setTimeout(() => {
                navigate('/user/my-bookings');
            }, 2000);

        } catch (err) {
            console.error('Gagal membuat pemesanan:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal membuat pemesanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mendapatkan tanggal minimum (hari ini)
    const getMinDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="box has-background-dark p-5">
            {loading && <LoadingSpinner message="Membuat pemesanan..." />}
            {error && (
                <div className="notification is-danger is-light mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="notification is-success is-light mb-4">
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Dropdown untuk memilih mobil */}
                <div className="field">
                    <label className="label has-text-light">Pilih Mobil Anda:</label>
                    <div className="control">
                        <div className="select is-medium is-dark is-fullwidth">
                            <select value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)} required>
                                <option value="">-- Pilih Mobil --</option>
                                {cars.map((car) => (
                                    <option key={car.carId} value={car.carId}>
                                        {car.make} {car.model} ({car.licensePlate})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dropdown untuk memilih jenis layanan */}
                <div className="field">
                    <label className="label has-text-light">Pilih Jenis Layanan:</label>
                    <div className="control">
                        <div className="select is-medium is-dark is-fullwidth">
                            <select value={selectedServiceTypeId} onChange={(e) => setSelectedServiceTypeId(e.target.value)} required>
                                <option value="">-- Pilih Layanan --</option>
                                {serviceTypes.map((service) => (
                                    <option key={service.serviceTypeId} value={service.serviceTypeId}>
                                        {service.name} - Rp{parseFloat(service.price).toLocaleString('id-ID')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pemilih Tanggal */}
                <div className="field">
                    <label className="label has-text-light">Tanggal Pemesanan:</label>
                    <div className="control">
                        <input
                            className="input is-medium is-dark"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={getMinDate()} // Memastikan tidak bisa memilih tanggal di masa lalu
                            required
                        />
                    </div>
                </div>

                {/* Pemilih Waktu */}
                <div className="field">
                    <label className="label has-text-light">Waktu Pemesanan:</label>
                    <div className="control">
                        <input
                            className="input is-medium is-dark"
                            type="time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Area Teks untuk Catatan Tambahan */}
                <div className="field">
                    <label className="label has-text-light">Catatan Tambahan (Opsional):</label>
                    <div className="control">
                        <textarea
                            className="textarea is-dark"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: Tolong periksa juga kondisi ban depan..."
                        ></textarea>
                    </div>
                </div>

                {/* Tombol Submit */}
                <div className="field mt-5">
                    <div className="control">
                        <button type="submit" className="button is-primary is-fullwidth is-medium" disabled={loading}>
                            {loading ? 'Membuat Booking...' : 'Konfirmasi Pemesanan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewBookingForm;
