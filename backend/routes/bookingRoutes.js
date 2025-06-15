// backend/routes/bookingRoutes.js
const express = require('express');
const { getBookings, getBookingById, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getBookings) // Admin melihat semua, user melihat miliknya
    .post(protect, createBooking); // User membuat booking, admin bisa membuat untuk user lain

router.route('/:id')
    .get(protect, getBookingById) // Admin melihat semua, user melihat miliknya
    .put(protect, updateBooking) // Admin bisa update semua, user bisa cancel miliknya
    .delete(protect, authorizeRoles('admin'), deleteBooking); // Hanya admin yang bisa menghapus

module.exports = router;