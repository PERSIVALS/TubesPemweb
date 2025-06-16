// frontend/src/pages/user/MyCarsPage.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import MyCarsList from '../../components/user/MyCarsList'; // Import komponen baru
import AddCarForm from '../../components/user/AddCarForm'; // Import komponen baru
import EditCarForm from '../../components/user/EditCarForm'; // Import komponen baru

const MyCarsPage = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false); // State untuk menampilkan form tambah
    const [showEditForm, setShowEditForm] = useState(false); // State untuk menampilkan form edit
    const [selectedCar, setSelectedCar] = useState(null); // State untuk mobil yang dipilih untuk diedit

    // Fungsi untuk mengambil daftar mobil milik user dari backend
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

    // Jalankan fetchCars saat komponen dimuat atau user berubah
    useEffect(() => {
        if (user) {
            fetchCars();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Handlers untuk Add, Edit, Delete
    const handleAddClick = () => {
        setShowAddForm(true);
        setShowEditForm(false); // Pastikan form edit tidak terbuka
        setSelectedCar(null);
    };

    const handleEditClick = (car) => {
        setSelectedCar(car);
        setShowEditForm(true);
        setShowAddForm(false); // Pastikan form tambah tidak terbuka
    };

    const handleDelete = async (carId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
            try {
                setLoading(true);
                await axiosClient.delete(`/cars/${carId}`);
                await fetchCars(); // Refresh daftar setelah hapus
            } catch (err) {
                console.error('Gagal menghapus mobil:', err);
                setError(err.response?.data?.message || 'Gagal menghapus mobil.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Callback setelah form Add/Edit berhasil disimpan
    const handleFormSuccess = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedCar(null);
        fetchCars(); // Refresh daftar mobil
    };

    // Callback untuk menutup form tanpa menyimpan
    const handleFormClose = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedCar(null);
    };

    if (loading) {
        return <LoadingSpinner message="Memuat daftar mobil Anda..." />;
    }

    if (error) {
        return (
            <section className="hero is-fullheight has-background-dark has-text-light is-flex is-justify-content-center is-align-items-center">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <p className="subtitle is-4 has-text-danger-light">{error}</p>
                        <button className="button is-primary is-small mt-3" onClick={fetchCars}>Coba Lagi</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">Mobil Saya</h1>
            <div className="box has-background-dark p-5">
                <p className="subtitle is-5 has-text-grey-light mb-5">
                    Halaman ini menampilkan daftar mobil Anda yang terdaftar dan memungkinkan Anda mengelolanya.
                </p>

                {/* Tombol Tambah Mobil Baru */}
                <button
                    className="button is-primary mb-5 is-rounded"
                    onClick={handleAddClick}
                >
                    <span className="icon">
                        <i className="fas fa-plus"></i>
                    </span>
                    <span>Tambahkan Mobil Baru</span>
                </button>

                {/* Conditional Rendering untuk Form Tambah */}
                {showAddForm && (
                    <div className="modal is-active">
                        <div className="modal-background" onClick={handleFormClose}></div>
                        <div className="modal-card has-background-dark has-text-light">
                            <header className="modal-card-head has-background-dark">
                                <p className="modal-card-title has-text-light">Tambahkan Mobil Baru</p>
                                <button className="delete" aria-label="close" onClick={handleFormClose}></button>
                            </header>
                            <section className="modal-card-body">
                                <AddCarForm onSuccess={handleFormSuccess} onClose={handleFormClose} />
                            </section>
                        </div>
                    </div>
                )}

                {/* Conditional Rendering untuk Form Edit */}
                {showEditForm && selectedCar && (
                    <div className="modal is-active">
                        <div className="modal-background" onClick={handleFormClose}></div>
                        <div className="modal-card has-background-dark has-text-light">
                            <header className="modal-card-head has-background-dark">
                                <p className="modal-card-title has-text-light">Edit Detail Mobil</p>
                                <button className="delete" aria-label="close" onClick={handleFormClose}></button>
                            </header>
                            <section className="modal-card-body">
                                <EditCarForm carToEdit={selectedCar} onSuccess={handleFormSuccess} onClose={handleFormClose} />
                            </section>
                        </div>
                    </div>
                )}

                {/* Tampilkan Daftar Mobil */}
                <MyCarsList cars={cars} onEdit={handleEditClick} onDelete={handleDelete} />

            </div>
        </div>
    );
};

export default MyCarsPage;
