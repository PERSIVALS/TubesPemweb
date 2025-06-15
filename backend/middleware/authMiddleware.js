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

            // Get user from the token (find by userId from the decoded token)
            // decoded.id harus cocok dengan primary key (userId) di model User
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] } // Jangan kirim password
            });

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) { // Pastikan req.user ada
            res.status(403);
            throw new Error(`User with role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };