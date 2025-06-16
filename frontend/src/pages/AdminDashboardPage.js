// frontend/src/pages/AdminDashboardPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="container p-4">
            {/* Judul Dashboard */}
            <h1 className="title is-2 has-text-primary mb-4 has-text-weight-bold">Admin Dashboard</h1>
            <p className="subtitle is-4 has-text-light mb-5">
                Selamat datang, <strong className="has-text-primary is-capitalized">{user?.name || user?.username}</strong>!
            </p>

            {/* Bagian Kartu Manajemen */}
            <div className="columns is-multiline">
                {/* Kartu Manage Users */}
                <div className="column is-one-third">
                    <div className="card has-background-dark-lighter has-text-light p-5 has-shadow-md is-rounded-lg">
                        <div className="card-content">
                            <p className="title is-4 has-text-light mb-3 has-text-weight-semibold">Manage Users</p>
                            <p className="subtitle is-6 has-text-grey-light mb-4">Lihat, buat, edit, atau hapus akun pengguna.</p>
                            <Link to="/admin/users" className="button is-primary is-small is-rounded has-text-weight-bold has-shadow-sm">
                                <span className="icon is-small">
                                    <i className="fas fa-users"></i>
                                </span>
                                <span>Go to Users</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Kartu Service Types */}
                <div className="column is-one-third">
                    <div className="card has-background-dark-lighter has-text-light p-5 has-shadow-md is-rounded-lg">
                        <div className="card-content">
                            <p className="title is-4 has-text-light mb-3 has-text-weight-semibold">Service Types</p>
                            <p className="subtitle is-6 has-text-grey-light mb-4">Definisikan dan kelola kategori layanan yang tersedia.</p>
                            <Link to="/admin/service-types" className="button is-primary is-small is-rounded has-text-weight-bold has-shadow-sm">
                                <span className="icon is-small">
                                    <i className="fas fa-tools"></i>
                                </span>
                                <span>Go to Service Types</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Kartu Manage Bookings */}
                <div className="column is-one-third">
                    <div className="card has-background-dark-lighter has-text-light p-5 has-shadow-md is-rounded-lg">
                        <div className="card-content">
                            <p className="title is-4 has-text-light mb-3 has-text-weight-semibold">Manage Bookings</p>
                            <p className="subtitle is-6 has-text-grey-light mb-4">Ringkasan dan kontrol semua janji temu layanan.</p>
                            <Link to="/admin/bookings" className="button is-primary is-small is-rounded has-text-weight-bold has-shadow-sm">
                                <span className="icon is-small">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                                <span>Go to Bookings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian System Overview */}
            <div className="box has-background-dark p-5 mt-6 has-shadow-md is-rounded-lg">
                <h3 className="title is-4 has-text-light mb-4 has-text-weight-semibold">System Overview</h3>
                <p className="has-text-grey-light subtitle is-6 mb-4">Bagian ini akan menampilkan metrik kunci dan aktivitas terbaru untuk aplikasi layanan mobil.</p>
                <div className="content">
                    <ul className="dashboard-stats">
                        <li className="has-text-grey-light mb-2 is-flex is-align-items-center">
                            <span className="icon is-medium mr-3 has-text-primary-light"><i className="fas fa-users fa-lg"></i></span>
                            <span className="is-size-5 has-text-weight-medium">Total Users:</span> <strong className="ml-2 has-text-light">[N/A]</strong>
                        </li>
                        <li className="has-text-grey-light mb-2 is-flex is-align-items-center">
                            <span className="icon is-medium mr-3 has-text-warning-light"><i className="fas fa-calendar-check fa-lg"></i></span>
                            <span className="is-size-5 has-text-weight-medium">Pending Bookings:</span> <strong className="ml-2 has-text-light">[N/A]</strong>
                        </li>
                        <li className="has-text-grey-light mb-2 is-flex is-align-items-center">
                            <span className="icon is-medium mr-3 has-text-success-light"><i className="fas fa-money-bill-wave fa-lg"></i></span>
                            <span className="is-size-5 has-text-weight-medium">Estimated Revenue (Month):</span> <strong className="ml-2 has-text-light">[N/A]</strong>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Catatan: Untuk fitur "Recent Activity" yang sebenarnya di Admin Dashboard,
                Anda perlu membuat komponen terpisah dan mengambil data yang relevan
                dari backend (misalnya, booking terbaru dari semua user).
                Placeholder di atas hanya untuk metrik statis.
            */}
        </div>
    );
};

export default AdminDashboardPage;
