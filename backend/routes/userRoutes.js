// backend/routes/userRoutes.js
const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/UserController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Hanya admin yang bisa melihat, mengupdate, dan menghapus user lain
router.route('/')
    .get(protect, authorizeRoles('admin'), getUsers);

router.route('/:id')
    .get(protect, authorizeRoles('admin'), getUserById)
    .put(protect, authorizeRoles('admin'), updateUser)
    .delete(protect, authorizeRoles('admin'), deleteUser);

module.exports = router;