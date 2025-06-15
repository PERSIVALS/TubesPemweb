// backend/controllers/UserController.js
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] } // Jangan kirim password
    });
    res.json(users);
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update a user (by admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role; // Admin bisa mengubah role

        if (req.body.password) {
            user.password = req.body.password; // Hook `beforeUpdate` akan menghashnya
        }

        const updatedUser = await user.save();
        res.json({
            userId: updatedUser.userId,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
        await user.destroy();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};