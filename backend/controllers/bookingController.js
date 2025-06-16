// backend/controllers/BookingController.js
const Booking = require('../models/BookingModel');
const User = require('../models/UserModel');
const Car = require('../models/CarModel');
const ServiceType = require('../models/ServiceTypeModel');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize'); // Import Op jika diperlukan untuk queries kompleks
const { v4: uuidv4 } = require('uuid'); // Untuk menghasilkan UUID untuk bookingId

// @desc    Get all bookings (Admin can see all, User can see their own)
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    let bookings;
    if (req.user.role === 'admin') {
        bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['userId', 'username', 'email'] },
                { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
                { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
            ],
            order: [['createdAt', 'DESC']]
        });
    } else {
        bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
                { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
    res.json(bookings);
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id, {
        include: [
            { model: User, as: 'user', attributes: ['userId', 'username', 'email'] },
            { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
            { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
        ]
    });

    if (booking) {
        if (req.user.role === 'admin' || booking.userId === req.user.id) {
            res.json(booking);
        } else {
            res.status(403);
            throw new Error('Tidak terotorisasi untuk melihat booking ini');
        }
    } else {
        res.status(404);
        throw new Error('Booking tidak ditemukan');
    }
});

// @desc    Get recent bookings for the logged-in user
// @route   GET /api/bookings/recent
// @access  Private (User)
const getRecentBookings = asyncHandler(async (req, res) => {
    const recentBookings = await Booking.findAll({
        where: { userId: req.user.id }, // Filter berdasarkan user yang login
        include: [
            { model: Car, as: 'car', attributes: ['make', 'model', 'licensePlate'] },
            { model: ServiceType, as: 'serviceType', attributes: ['name', 'price'] }
        ],
        order: [['bookingDate', 'DESC'], ['bookingTime', 'DESC']], // Urutkan berdasarkan tanggal dan waktu booking terbaru
        limit: 5 // Batasi hasilnya, misal 5 booking terakhir
    });
    res.json(recentBookings);
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
const createBooking = asyncHandler(async (req, res) => {
    const { carId, serviceTypeId, bookingDate, bookingTime, notes } = req.body;

    if (!carId || !serviceTypeId || !bookingDate || !bookingTime) {
        res.status(400);
        throw new Error('Mohon lengkapi semua bidang yang wajib: car, service type, booking date, dan booking time.');
    }

    const booking = await Booking.create({
        bookingId: uuidv4(), // Generate UUID
        userId: req.user.id, // Ambil userId dari user yang sedang login
        carId,
        serviceTypeId,
        bookingDate,
        bookingTime,
        notes: notes || '',
        status: 'pending' // Default status
    });

    if (booking) {
        res.status(201).json(booking);
    } else {
        res.status(400);
        throw new Error('Data booking tidak valid.');
    }
});

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private (Admin, User can update their own status/notes)
const updateBooking = asyncHandler(async (req, res) => {
    const { status, notes, bookingDate, bookingTime, carId, serviceTypeId } = req.body;

    const booking = await Booking.findByPk(req.params.id);

    if (booking) {
        // Hanya admin yang bisa update booking milik user lain
        // User hanya bisa update booking miliknya sendiri
        if (req.user.role === 'admin' || booking.userId === req.user.id) {
            // Admin bisa update semua field
            if (req.user.role === 'admin') {
                booking.carId = carId || booking.carId;
                booking.serviceTypeId = serviceTypeId || booking.serviceTypeId;
                booking.bookingDate = bookingDate || booking.bookingDate;
                booking.bookingTime = bookingTime || booking.bookingTime;
                booking.status = status || booking.status;
                booking.notes = notes || booking.notes;
            } else { // User biasa hanya bisa update status (cancel) dan notes
                if (status) { // Misal user hanya bisa cancel booking
                    if (status === 'cancelled') {
                        booking.status = 'cancelled';
                    } else {
                        res.status(403);
                        throw new Error('User tidak diizinkan mengubah status booking menjadi ini.');
                    }
                }
                booking.notes = notes || booking.notes;
            }

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(403);
            throw new Error('Tidak terotorisasi untuk memperbarui booking ini');
        }
    } else {
        res.status(404);
        throw new Error('Booking tidak ditemukan');
    }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin, User can delete their own pending/cancelled booking)
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);

    if (booking) {
        if (req.user.role === 'admin' || booking.userId === req.user.id) {
            // User hanya bisa menghapus booking jika statusnya pending atau cancelled
            if (req.user.role === 'user' && !['pending', 'cancelled'].includes(booking.status)) {
                res.status(403);
                throw new Error('User hanya bisa menghapus booking dengan status pending atau cancelled.');
            }
            await booking.destroy();
            res.json({ message: 'Booking berhasil dihapus' });
        } else {
            res.status(403);
            throw new Error('Tidak terotorisasi untuk menghapus booking ini');
        }
    } else {
        res.status(404);
        throw new Error('Booking tidak ditemukan');
    }
});

module.exports = {
    getBookings,
    getBookingById,
    getRecentBookings, // Export fungsi baru ini
    createBooking,
    updateBooking,
    deleteBooking
};
