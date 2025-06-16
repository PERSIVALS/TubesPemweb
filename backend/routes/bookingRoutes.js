// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
    getBookings,
    getBookingById,
    getRecentBookings, // Import fungsi baru
    createBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/BookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Route untuk mendapatkan booking terbaru (recent activity)
// Ini akan dipanggil oleh dashboard user untuk menampilkan aktivitas terakhir
router.get('/recent', protect, getRecentBookings); // Rute baru untuk dashboard user

// Route untuk operasi CRUD standar pada bookings
// Semua route di bawah ini juga dilindungi oleh middleware 'protect'
router.route('/')
    .get(protect, getBookings) // Admin bisa melihat semua booking, user melihat booking miliknya sendiri
    .post(protect, createBooking); // User bisa membuat booking baru

router.route('/:id')
    .get(protect, getBookingById) // Mendapatkan detail booking berdasarkan ID
    .put(protect, updateBooking) // Memperbarui detail booking (admin bisa semua, user hanya miliknya)
    .delete(protect, deleteBooking); // Menghapus booking (admin bisa semua, user hanya miliknya jika status pending/cancelled)

module.exports = router;
