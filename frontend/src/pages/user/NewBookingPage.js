// frontend/src/pages/user/NewBookingPage.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import NewBookingForm from '../../components/user/NewBookingForm';
import { Link } from 'react-router-dom';

const NewBookingPage = () => {
    const [cars, setCars] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCars = async () => {
        try {
            const response = await axiosClient.get('/cars');
            setCars(response.data);
        } catch (err) {
            console.error('Gagal mengambil daftar mobil:', err);
            throw new Error(err.response?.data?.message || 'Gagal memuat mobil Anda.');
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await axiosClient.get('/service-types');
            setServiceTypes(response.data);
        } catch (err) {
            console.error('Gagal mengambil jenis layanan:', err);
            throw new Error(err.response?.data?.message || 'Gagal memuat jenis layanan.');
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            setError('');
            try {
                await Promise.all([fetchCars(), fetchServiceTypes()]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Pesan Layanan Baru</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Silakan isi form booking di bawah ini untuk memesan layanan. Pastikan semua data yang Anda masukkan sudah benar.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-3 text-lg text-gray-700">Memuat data pemesanan...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-50 text-red-800 px-2 py-1 rounded text-xs font-medium hover:bg-red-100"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-md mb-6">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="font-medium">Anda perlu menambahkan mobil terlebih dahulu sebelum bisa membuat pemesanan layanan.</p>
                                <div className="mt-3">
                                    <Link
                                        to="/user/my-cars"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Tambahkan Mobil Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : serviceTypes.length === 0 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-md mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p>Tidak ada jenis layanan yang tersedia saat ini. Mohon coba lagi nanti atau hubungi admin.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="md:flex">
                                <div className="p-8 md:p-12 md:w-3/5">
                                    <h2 className="text-2xl font-bold text-white mb-4">Pesan Layanan Mobil dengan Mudah</h2>
                                    <ul className="space-y-3 text-white">
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Pilih kendaraan Anda dari daftar</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Pilih layanan sesuai kebutuhan Anda</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tentukan jadwal yang sesuai dengan waktu Anda</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Dapatkan konfirmasi dan lacak status pemesanan Anda</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="md:w-2/5 relative">
                                    <div className="absolute inset-0 bg-blue-800 opacity-20"></div>
                                    <img 
                                        className="h-full w-full object-cover" 
                                        src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2FyJTIwc2VydmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" 
                                        alt="Car service"
                                    />
                                </div>
                            </div>
                        </div>

                        <NewBookingForm cars={cars} serviceTypes={serviceTypes} />
                    </>
                )}
            </div>
        </div>
    );
};

export default NewBookingPage;
