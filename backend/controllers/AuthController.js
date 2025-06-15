// backend/controllers/AuthController.js
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Fungsi untuk menghasilkan token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, name, phone } = req.body;

    // Cek apakah user sudah ada berdasarkan username atau email
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
        res.status(400);
        throw new Error('Username already exists');
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
        res.status(400);
        throw new Error('Email already registered');
    }

    // Buat user baru (password akan di-hash oleh hook di model User)
    const user = await User.create({
        username,
        email,
        password,
        name,
        phone,
        role: 'user' // Default role
    });

    if (user) {
        res.status(201).json({
            userId: user.userId,
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            token: generateToken(user.userId, user.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });

    // Cek password
    if (user && (await user.matchPassword(password))) {
        res.json({
            userId: user.userId,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            token: generateToken(user.userId, user.role),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user sudah diset oleh authMiddleware (berisi userId dari token)
    const user = await User.findByPk(req.user.id, { // Menggunakan findByPk untuk mencari berdasarkan primary key
        attributes: { exclude: ['password'] } // Jangan kirim password
    });

    if (user) {
        res.json({
            userId: user.userId,
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        if (req.body.password) {
            user.password = req.body.password; // Hook `beforeUpdate` akan menghashnya
        }

        const updatedUser = await user.save(); // Simpan perubahan

        res.json({
            userId: updatedUser.userId,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            role: updatedUser.role,
            token: generateToken(updatedUser.userId, updatedUser.role), // Generate token baru
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};