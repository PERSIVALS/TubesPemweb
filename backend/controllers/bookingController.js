// backend/controllers/BookingController.js
const Booking = require('../models/BookingModel');
const Car = require('../models/CarModel');
const ServiceType = require('../models/ServiceTypeModel');
const User = require('../models/UserModel'); // Perlu diimpor untuk `include` relasi
const asyncHandler = require('express-async-handler');

// @desc    Get all bookings (Admin) or bookings for specific user (User)
// @route   GET /api/bookings (Admin)
// @route   GET /api/bookings/my (User)
// @access  Private/Admin, Private/User
const getBookings = asyncHandler(async (req, res) => {
    let bookings;
    if (req.user.role === 'admin') {
        // Admin dapat melihat semua booking dengan detail user, mobil, dan layanan
        bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['userId', 'username', 'name', 'email'] },
                { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
                { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
            ]
        });
    } else {
        // User hanya dapat melihat booking mereka sendiri
        bookings = await Booking.findAll({
            where: { userId: req.user.id }, // req.user.id adalah ID user dari token
            include: [
                { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
                { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
            ]
        });
    }
    res.json(bookings);
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Admin can get any, User can get their own)
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id, {
        include: [
            { model: User, as: 'user', attributes: ['userId', 'username', 'name', 'email'] },
            { model: Car, as: 'car', attributes: ['carId', 'make', 'model', 'licensePlate'] },
            { model: ServiceType, as: 'serviceType', attributes: ['serviceTypeId', 'name', 'price'] }
        ]
    });

    if (booking) {
        // Admin bisa melihat booking siapa saja
        // User hanya bisa melihat booking miliknya
        if (req.user.role === 'admin' || booking.userId === req.user.id) {
            res.json(booking);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this booking');
        }
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/User (or Admin creating for a user)
const createBooking = asyncHandler(async (req, res) => {
    const { userId, carId, serviceTypeId, bookingDate, bookingTime, notes } = req.body;

    // Tentukan ID pengguna yang membuat booking
    const bookerId = req.user.role === 'admin' && userId ? userId : req.user.id;

    // Validasi input dasar
    if (!bookerId || !carId || !serviceTypeId || !bookingDate || !bookingTime) {
        res.status(400);
        throw new Error('Please provide all required fields for the booking.');
    }

    // Pastikan mobil milik user yang bersangkutan (jika bukan admin)
    const car = await Car.findByPk(carId);
    if (!car || (req.user.role !== 'admin' && car.userId !== bookerId)) {
        res.status(400);
        throw new Error('Selected car is invalid or does not belong to the user.');
    }

    // Pastikan service type valid
    const serviceType = await ServiceType.findByPk(serviceTypeId);
    if (!serviceType) {
        res.status(400);
        throw new Error('Selected service type is invalid.');
    }

    // Buat booking
    const booking = await Booking.create({
        userId: bookerId,
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
        throw new Error('Invalid booking data');
    }
});

// @desc    Update a booking (Admin can change status, User can cancel their own)
// @route   PUT /api/bookings/:id
// @access  Private (Admin, User)
const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);

    if (booking) {
        // Admin dapat mengubah semua field
        if (req.user.role === 'admin') {
            booking.userId = req.body.userId || booking.userId;
            booking.carId = req.body.carId || booking.carId;
            booking.serviceTypeId = req.body.serviceTypeId || booking.serviceTypeId;
            booking.bookingDate = req.body.bookingDate || booking.bookingDate;
            booking.bookingTime = req.body.bookingTime || booking.bookingTime;
            booking.status = req.body.status || booking.status;
            booking.notes = req.body.notes || booking.notes;
        } else if (booking.userId === req.user.id) {
            // User hanya dapat mengubah status menjadi 'cancelled'
            if (req.body.status && req.body.status === 'cancelled') {
                booking.status = 'cancelled';
            } else {
                res.status(403);
                throw new Error('Not authorized to update this booking (users can only cancel)');
            }
        } else {
            res.status(403);
            throw new Error('Not authorized to update this booking');
        }

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);

    if (booking) {
        // Hanya admin yang bisa menghapus booking
        if (req.user.role === 'admin') {
            await booking.destroy(); // Menggunakan destroy untuk Sequelize
            res.json({ message: 'Booking removed' });
        } else {
            res.status(403);
            throw new Error('Not authorized to delete this booking');
        }
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};