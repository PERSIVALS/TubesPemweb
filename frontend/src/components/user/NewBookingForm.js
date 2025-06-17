// frontend/src/components/user/NewBookingForm.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Pastikan path ini benar

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
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);

    // Update the selected car and service when IDs change
    useEffect(() => {
        if (selectedCarId) {
            const car = cars.find(car => car.carId.toString() === selectedCarId.toString());
            setSelectedCar(car || null);
        } else {
            setSelectedCar(null);
        }
        
        if (selectedServiceTypeId) {
            const service = serviceTypes.find(service => 
                service.serviceTypeId.toString() === selectedServiceTypeId.toString());
            setSelectedService(service || null);
        } else {
            setSelectedService(null);
        }
    }, [selectedCarId, selectedServiceTypeId, cars, serviceTypes]);

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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {success && (
                <div className="bg-green-50 p-4 border-l-4 border-green-500">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Choose Car */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">1. Pilih Mobil Anda</label>
                        <div className="relative">
                            <select
                                value={selectedCarId}
                                onChange={(e) => setSelectedCarId(e.target.value)}
                                required
                                className="block w-full pl-3 pr-10 py-3 text-base text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-50 hover:bg-white transition-colors"
                            >
                                <option value="">-- Pilih Mobil --</option>
                                {cars.map((car) => (
                                    <option key={car.carId} value={car.carId}>
                                        {car.make} {car.model} ({car.licensePlate})
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {selectedCar && (
                            <div className="mt-3 bg-blue-50 p-3 rounded-md flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-blue-800">{selectedCar.make} {selectedCar.model}</p>
                                    <p className="text-xs text-blue-600">{selectedCar.licensePlate} {selectedCar.color && `• ${selectedCar.color}`} {selectedCar.year && `• ${selectedCar.year}`}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Choose Service Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">2. Pilih Jenis Layanan</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {serviceTypes.map((service) => (
                                <div 
                                    key={service.serviceTypeId} 
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedServiceTypeId.toString() === service.serviceTypeId.toString() 
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' 
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedServiceTypeId(service.serviceTypeId)}
                                >
                                    <div className="font-medium text-gray-900">{service.name}</div>
                                    <div className="mt-1 text-sm text-gray-500">{service.description && service.description.substring(0, 60)}{service.description && service.description.length > 60 ? '...' : ''}</div>
                                    <div className="mt-2 text-blue-600 font-medium">Rp{parseFloat(service.price).toLocaleString('id-ID')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Choose Date and Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">3. Pilih Tanggal dan Waktu</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={getMinDate()}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 text-base text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Waktu</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="time"
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 text-base text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Additional Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">4. Catatan Tambahan (Opsional)</label>
                        <div className="mt-1">
                            <textarea
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tambahkan catatan atau instruksi khusus untuk teknisi kami..."
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    {(selectedCar || selectedService) && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Ringkasan Pemesanan</h3>
                            <div className="space-y-2">
                                {selectedCar && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Kendaraan:</span>
                                        <span className="font-medium text-gray-900">{selectedCar.make} {selectedCar.model} ({selectedCar.licensePlate})</span>
                                    </div>
                                )}
                                
                                {selectedService && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Layanan:</span>
                                        <span className="font-medium text-gray-900">{selectedService.name}</span>
                                    </div>
                                )}
                                
                                {selectedService && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Harga:</span>
                                        <span className="font-medium text-blue-600">Rp{parseFloat(selectedService.price).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                
                                {bookingDate && bookingTime && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Jadwal:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(bookingDate).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} - {bookingTime}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Membuat Pemesanan...
                                </div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Konfirmasi Pemesanan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBookingForm;
