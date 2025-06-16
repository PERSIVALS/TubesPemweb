// frontend/src/pages/user/NewBookingPage.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Pastikan path ini benar ke axiosClient Anda
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Import LoadingSpinner
import NewBookingForm from '../../components/user/NewBookingForm'; // Import NewBookingForm yang sudah Anda isi sebelumnya
import { Link } from 'react-router-dom'; // Import Link untuk navigasi

const NewBookingPage = () => {
    const [cars, setCars] = useState([]); // State untuk menyimpan daftar mobil
    const [serviceTypes, setServiceTypes] = useState([]); // State untuk menyimpan daftar jenis layanan
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fungsi untuk mengambil daftar mobil milik user
    const fetchCars = async () => {
        try {
            const response = await axiosClient.get('/cars'); // Endpoint untuk mobil user
            setCars(response.data);
        } catch (err) {
            console.error('Gagal mengambil daftar mobil:', err);
            throw new Error(err.response?.data?.message || 'Gagal memuat mobil Anda.');
        }
    };

    // Fungsi untuk mengambil daftar jenis layanan dari backend
    const fetchServiceTypes = async () => {
        try {
            const response = await axiosClient.get('/service-types'); // Endpoint untuk jenis layanan
            setServiceTypes(response.data);
        } catch (err) {
            console.error('Gagal mengambil jenis layanan:', err);
            throw new Error(err.response?.data?.message || 'Gagal memuat jenis layanan.');
        }
    };

    // Mengambil semua data yang diperlukan (mobil & jenis layanan) saat komponen dimuat
    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            setError('');
            try {
                // Jalankan kedua fetch secara paralel
                await Promise.all([fetchCars(), fetchServiceTypes()]);
            } catch (err) {
                setError(err.message); // Tangkap error dari salah satu fetch
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []); // Array kosong berarti hanya berjalan sekali saat mount

    if (loading) {
        return <LoadingSpinner message="Memuat data pemesanan..." />;
    }

    if (error) {
        return (
            <div className="container p-4">
                <div className="notification is-danger">
                    <p>{error}</p>
                    <button className="button is-small is-light mt-2" onClick={() => window.location.reload()}>Coba Lagi</button>
                </div>
            </div>
        );
    }

    // Jika tidak ada mobil yang terdaftar, berikan pesan dan tombol untuk menambah mobil
    if (cars.length === 0) {
        return (
            <div className="container p-4">
                <div className="notification is-warning is-light">
                    Anda perlu menambahkan mobil terlebih dahulu sebelum bisa membuat pemesanan layanan.
                    <Link to="/user/my-cars" className="button is-small is-primary ml-3">Tambahkan Mobil</Link>
                </div>
            </div>
        );
    }

    // Jika tidak ada jenis layanan yang tersedia, berikan pesan
    if (serviceTypes.length === 0) {
        return (
            <div className="container p-4">
                <div className="notification is-warning is-light">
                    Tidak ada jenis layanan yang tersedia saat ini. Mohon coba lagi nanti atau hubungi admin.
                </div>
            </div>
        );
    }

    // Render NewBookingForm jika semua data berhasil dimuat dan tersedia
    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">Pesan Layanan Baru</h1>
            {/* Teruskan data mobil dan jenis layanan ke NewBookingForm */}
            <NewBookingForm cars={cars} serviceTypes={serviceTypes} />
        </div>
    );
};

export default NewBookingPage;
