// frontend/src/pages/user/MyCarsPage.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import MyCarsList from '../../components/user/MyCarsList';
import AddCarForm from '../../components/user/AddCarForm';
import EditCarForm from '../../components/user/EditCarForm';

const MyCarsPage = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axiosClient.get('/cars');
            setCars(response.data);
        } catch (err) {
            console.error('Gagal mengambil daftar mobil:', err);
            setError(err.response?.data?.message || 'Gagal memuat daftar mobil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCars();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleAddClick = () => {
        setShowAddForm(true);
        setShowEditForm(false);
        setSelectedCar(null);
    };

    const handleEditClick = (car) => {
        setSelectedCar(car);
        setShowEditForm(true);
        setShowAddForm(false);
    };

    const handleDelete = async (carId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
            try {
                setLoading(true);
                await axiosClient.delete(`/cars/${carId}`);
                await fetchCars();
            } catch (err) {
                console.error('Gagal menghapus mobil:', err);
                setError(err.response?.data?.message || 'Gagal menghapus mobil.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormSuccess = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedCar(null);
        fetchCars();
    };

    const handleFormClose = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedCar(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Mobil Saya</h1>
                    <p className="mt-2 text-sm text-gray-600 max-w-4xl">
                        Kelola kendaraan Anda yang terdaftar di CarService untuk mempermudah proses booking dan pelayanan.
                    </p>
                </div>

                {/* Add Car Button */}
                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={handleAddClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambahkan Mobil Baru
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
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
                                        onClick={fetchCars}
                                        className="bg-red-50 text-red-800 px-2 py-1 rounded text-xs font-medium hover:bg-red-100"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-3 text-lg text-gray-700">Memuat daftar mobil Anda...</p>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg p-6">
                        <MyCarsList cars={cars} onEdit={handleEditClick} onDelete={handleDelete} />
                    </div>
                )}

                {/* Add Form Modal */}
                {showAddForm && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tambahkan Mobil Baru</h3>
                                            <div className="mt-4">
                                                <AddCarForm onSuccess={handleFormSuccess} onClose={handleFormClose} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form Modal */}
                {showEditForm && selectedCar && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Edit Detail Mobil
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({selectedCar.make} {selectedCar.model})
                                                </span>
                                            </h3>
                                            <div className="mt-4">
                                                <EditCarForm carToEdit={selectedCar} onSuccess={handleFormSuccess} onClose={handleFormClose} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCarsPage;
