// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel'); // Menggunakan model Sequelize

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Penting: Pastikan payload token berisi 'id' dan 'role'
            // Di AuthController, generateToken(user.userId, user.role) berarti 'id' adalah userId.
            if (!decoded.id || !decoded.role) {
                res.status(401);
                throw new Error('Token tidak valid: payload ID atau Role missing.');
            }

            // Ambil user dari database menggunakan ID yang didecode dari token
            // Kita ambil data user lengkap (tanpa password) dan tambahkan ke req.user
            const userFromDb = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!userFromDb) {
                res.status(401);
                throw new Error('Tidak terotorisasi, user tidak ditemukan di database.');
            }

            // Set req.user dengan data yang relevan dari userFromDb
            // Ini akan memastikan req.user memiliki properti userId dan role yang bisa diakses
            req.user = {
                id: userFromDb.userId, // Pastikan ini adalah userId dari DB
                role: userFromDb.role,
                username: userFromDb.username, // Anda bisa menambahkan properti lain yang diperlukan
                email: userFromDb.email
                // Jangan sertakan password atau data sensitif lainnya
            };

            next();
        } catch (error) {
            console.error("Auth middleware error:", error); // Log error lebih spesifik
            res.status(401);
            throw new Error('Tidak terotorisasi, token gagal atau tidak valid.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Tidak terotorisasi, tidak ada token.');
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user harus sudah diset oleh middleware protect sebelumnya
        // req.user.role diakses dari objek yang kita buat di middleware protect
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User with role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
