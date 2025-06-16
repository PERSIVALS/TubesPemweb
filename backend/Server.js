// backend/server.js
const express = require('express');
const dotenv = require('dotenv').config(); // Pastikan ini di baris paling atas
const cors = require('cors');
const path = require('path'); // Import modul path untuk path absolut
const { sequelize, connectDB } = require('./config/Database');
const fs = require('fs'); // Import fs untuk membuat direktori

// Import models to ensure they are defined and associated before synchronization
const User = require('./models/UserModel');
const Car = require('./models/CarModel');
const ServiceType = require('./models/ServiceTypeModel');
const Booking = require('./models/BookingModel');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
const startServer = async () => {
    try {
        await connectDB();

        // Middleware
        app.use(express.json()); // Untuk parsing body JSON
        app.use(express.urlencoded({ extended: false })); // Untuk parsing URL-encoded data
        app.use(cors()); // Mengizinkan cross-origin requests dari frontend

        // --- Tambahan untuk menyajikan file statis (gambar) ---
        // Membuat folder 'uploads' jika belum ada
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) { // Menggunakan fs.existsSync
            fs.mkdirSync(uploadDir); // Menggunakan fs.mkdirSync
        }
        app.use('/uploads', express.static(uploadDir)); // Menyajikan file dari folder 'uploads' di http://localhost:5000/uploads
        // --- Akhir Tambahan ---

        // Routes
        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/users', require('./routes/userRoutes'));
        app.use('/api/cars', require('./routes/carRoutes'));
        app.use('/api/service-types', require('./routes/serviceTypeRoutes'));
        app.use('/api/bookings', require('./routes/bookingRoutes'));

        // Error handling middleware (Penting untuk menangani error Express secara terpusat)
        // Middleware ini harus diletakkan setelah semua rute
        app.use((err, req, res, next) => {
            console.error(err.stack); // Log stack trace error untuk debugging
            const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Jika status masih 200, ubah ke 500
            res.status(statusCode);
            res.json({
                message: err.message,
                // Sertakan stack trace hanya di mode development
                stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });

    } catch (error) {
        console.error('Failed to connect to the database or start server:', error);
        process.exit(1); // Keluar dari proses jika ada error fatal
    }
};

startServer(); // Panggil fungsi untuk memulai server
