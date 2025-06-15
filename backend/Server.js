// backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { sequelize, connectDB } = require('./config/Database'); // Import sequelize dan connectDB

// Import models to ensure they are defined and associated before synchronization
// Require each model file
const User = require('./models/UserModel');
const Car = require('./models/CarModel');
const ServiceType = require('./models/ServiceTypeModel');
const Booking = require('./models/BookingModel');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
// Ini akan memanggil sequelize.authenticate() dan sequelize.sync()
connectDB();

// Middleware
app.use(express.json()); // Untuk parsing body JSON
app.use(express.urlencoded({ extended: false })); // Untuk parsing URL-encoded data
app.use(cors()); // Mengizinkan cross-origin requests dari frontend

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/service-types', require('./routes/serviceTypeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Error handling middleware (Penting untuk menangani error Express secara terpusat)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});