// backend/routes/carRoutes.js
const express = require('express');
const { getCars, getCarById, addCar, updateCar, deleteCar } = require('../controllers/CarController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getCars)
    .post(protect, addCar); // Admin bisa menambahkan car untuk user lain, user bisa untuk dirinya sendiri

router.route('/:id')
    .get(protect, getCarById)
    .put(protect, updateCar) // Admin bisa update semua, user bisa update miliknya
    .delete(protect, deleteCar); // Admin bisa menghapus semua, user bisa menghapus miliknya

module.exports = router;