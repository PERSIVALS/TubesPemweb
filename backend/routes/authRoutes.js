// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;