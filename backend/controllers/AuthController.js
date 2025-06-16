// backend/controllers/AuthController.js
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs'); // Dipakai di UserModel (hook), bukan di controller secara langsung untuk hash password saat create

// Fungsi untuk menghasilkan token JWT
// id: userId, role: peran user (e.g., 'user', 'admin')
const generateToken = (id, role) => {
    // Pastikan JWT_SECRET dan JWT_EXPIRE ada di file .env backend
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in .env!");
        throw new Error("Server configuration error: JWT_SECRET missing.");
    }
    if (!process.env.JWT_EXPIRE) {
        console.warn("JWT_EXPIRE is not defined in .env, using default '1h'");
    }

    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h', // Default 1 jam jika tidak diset
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, name, phone } = req.body;

    // --- Validasi Input ---
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please enter all required fields: username, email, and password.');
    }

    // Cek apakah user sudah ada berdasarkan username
    const userExistsByUsername = await User.findOne({ where: { username } });
    if (userExistsByUsername) {
        res.status(400);
        throw new Error('Username already exists. Please choose a different one.');
    }

    // Cek apakah email sudah terdaftar
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
        res.status(400);
        throw new Error('Email already registered. Please use a different email.');
    }

    // --- Membuat User Baru ---
    // Password akan di-hash oleh hook `beforeCreate` di model User,
    // jadi tidak perlu `bcrypt.hash` di sini.
    const user = await User.create({
        username,
        email,
        password, // password akan di-hash oleh hook di model
        name,
        phone,
        role: 'user' // Default role untuk pengguna baru adalah 'user'
    });

    if (user) {
        // Jika user berhasil dibuat, kirim respons sukses
        res.status(201).json({
            userId: user.userId, // Pastikan UserModel menghasilkan userId yang valid (misalnya UUID)
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role, // Penting: ROLE disertakan dalam respons JSON
            token: generateToken(user.userId, user.role), // Token berisi userId dan role
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data received during registration.');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });

    // Cek password menggunakan method `matchPassword` dari model User
    if (user && (await user.matchPassword(password))) {
        res.json({
            userId: user.userId,
            username: user.username,
            email: user.email,
            name: user.name, // Sertakan name di login response
            phone: user.phone, // Sertakan phone di login response
            role: user.role, // Penting: ROLE disertakan dalam respons JSON
            token: generateToken(user.userId, user.role), // Token berisi userId dan role
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid username or password.');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user diset oleh authMiddleware (berisi id dan role dari token)
    // Pastikan authMiddleware melampirkan 'id' sebagai primary key yang benar (userId)
    const user = await User.findByPk(req.user.id, {
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
        throw new Error('User not found.');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // req.user.id berasal dari token yang didecode di authMiddleware
    const user = await User.findByPk(req.user.id);

    if (user) {
        // Hanya update field yang ada di body request
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        // Jika password baru disediakan, itu akan di-hash oleh hook `beforeUpdate` di model User
        if (req.body.password) {
            user.password = req.body.password;
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
        throw new Error('User not found.');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};