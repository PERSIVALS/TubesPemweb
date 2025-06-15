// backend/controllers/CarController.js
const Car = require('../models/CarModel');
const User = require('../models/UserModel'); // Import User untuk relasi
const asyncHandler = require('express-async-handler');

// @desc    Get all cars (Admin) or cars for specific user (User)
// @route   GET /api/cars
// @access  Private (Admin can see all, User can see their own)
const getCars = asyncHandler(async (req, res) => {
    let cars;
    if (req.user.role === 'admin') {
        cars = await Car.findAll({
            include: [{ model: User, as: 'user', attributes: ['userId', 'username', 'name', 'email'] }]
        });
    } else {
        cars = await Car.findAll({
            where: { userId: req.user.id }
        });
    }
    res.json(cars);
});

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Private (Admin can get any, User can get their own)
const getCarById = asyncHandler(async (req, res) => {
    const car = await Car.findByPk(req.params.id, {
        include: [{ model: User, as: 'user', attributes: ['userId', 'username', 'name', 'email'] }]
    });

    if (car) {
        if (req.user.role === 'admin' || car.userId === req.user.id) {
            res.json(car);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this car');
        }
    } else {
        res.status(404);
        throw new Error('Car not found');
    }
});

// @desc    Add a new car
// @route   POST /api/cars
// @access  Private/User (or Admin adding for a user)
const addCar = asyncHandler(async (req, res) => {
    const { userId, make, model, year, licensePlate, color } = req.body;

    // Tentukan ID pengguna pemilik mobil
    const ownerId = req.user.role === 'admin' && userId ? userId : req.user.id;

    if (!ownerId || !make || !model || !licensePlate) {
        res.status(400);
        throw new Error('Please add all required fields: userId, make, model, licensePlate');
    }

    // Cek apakah plat nomor sudah ada
    const carExists = await Car.findOne({ where: { licensePlate } });
    if (carExists) {
        res.status(400);
        throw new Error('Car with this license plate already exists');
    }

    const car = await Car.create({
        userId: ownerId,
        make,
        model,
        year,
        licensePlate,
        color
    });

    if (car) {
        res.status(201).json(car);
    } else {
        res.status(400);
        throw new Error('Invalid car data');
    }
});

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private (Admin, User)
const updateCar = asyncHandler(async (req, res) => {
    const car = await Car.findByPk(req.params.id);

    if (car) {
        // Hanya admin yang bisa update car milik user lain
        // User hanya bisa update car miliknya sendiri
        if (req.user.role === 'admin' || car.userId === req.user.id) {
            car.make = req.body.make || car.make;
            car.model = req.body.model || car.model;
            car.year = req.body.year || car.year;
            car.licensePlate = req.body.licensePlate || car.licensePlate;
            car.color = req.body.color || car.color;

            // Jika admin ingin mengubah pemilik mobil
            if (req.user.role === 'admin' && req.body.userId) {
                const newOwner = await User.findByPk(req.body.userId);
                if (newOwner) {
                    car.userId = req.body.userId;
                } else {
                    res.status(400);
                    throw new Error('New user ID is invalid');
                }
            }

            const updatedCar = await car.save();
            res.json(updatedCar);
        } else {
            res.status(403);
            throw new Error('Not authorized to update this car');
        }
    } else {
        res.status(404);
        throw new Error('Car not found');
    }
});

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private (Admin, User)
const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findByPk(req.params.id);

    if (car) {
        // Hanya admin yang bisa menghapus car milik user lain
        // User hanya bisa menghapus car miliknya sendiri
        if (req.user.role === 'admin' || car.userId === req.user.id) {
            await car.destroy();
            res.json({ message: 'Car removed' });
        } else {
            res.status(403);
            throw new Error('Not authorized to delete this car');
        }
    } else {
        res.status(404);
        throw new Error('Car not found');
    }
});

module.exports = {
    getCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar
};