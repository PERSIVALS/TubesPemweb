// backend/controllers/CarController.js
const Car = require('../models/CarModel');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const path = require('path'); // Import path untuk manipulasi path file
const fs = require('fs'); // Import fs untuk menghapus file lama

// @desc    Get all cars for the logged-in user
// @route   GET /api/cars
// @access  Private (User)
const getMyCars = asyncHandler(async (req, res) => {
    const cars = await Car.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
    });
    // Jika perlu, sesuaikan imageUrl agar menjadi URL lengkap
    const carsWithFullImageUrl = cars.map(car => {
        if (car.imageUrl) {
            // Asumsikan server berjalan di PORT, dan file disajikan dari /uploads
            return {
                ...car.toJSON(),
                imageUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(car.imageUrl)}`
            };
        }
        return car.toJSON();
    });
    res.json(carsWithFullImageUrl);
});

// @desc    Get a single car by ID for the logged-in user
// @route   GET /api/cars/:id
// @access  Private (User)
const getCarById = asyncHandler(async (req, res) => {
    const car = await Car.findOne({
        where: {
            carId: req.params.id,
            userId: req.user.id
        }
    });

    if (car) {
        // Sesuaikan imageUrl menjadi URL lengkap sebelum dikirim
        const carData = car.toJSON();
        if (carData.imageUrl) {
            carData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(carData.imageUrl)}`;
        }
        res.json(carData);
    } else {
        res.status(404);
        throw new Error('Mobil tidak ditemukan atau Anda tidak memiliki akses ke mobil ini.');
    }
});

// @desc    Create a new car for the logged-in user
// @route   POST /api/cars
// @access  Private (User)
const createCar = asyncHandler(async (req, res) => {
    const { make, model, year, licensePlate, color } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Ambil path file dari multer

    if (!make || !model || !licensePlate) {
        // Jika ada file yang diunggah tapi ada validasi error, hapus file tersebut
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Gagal menghapus file yang diunggah:", err);
            });
        }
        res.status(400);
        throw new Error('Mohon lengkapi semua bidang yang wajib: Merk, Model, dan Plat Nomor.');
    }

    const existingCar = await Car.findOne({ where: { licensePlate } });
    if (existingCar) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Gagal menghapus file yang diunggah:", err);
            });
        }
        res.status(400);
        throw new Error('Plat nomor ini sudah terdaftar untuk mobil lain.');
    }

    const car = await Car.create({
        carId: uuidv4(),
        userId: req.user.id,
        make,
        model,
        year: year || null,
        licensePlate,
        color: color || null,
        imageUrl: imageUrl // Simpan path file di database
    });

    if (car) {
        const carData = car.toJSON();
        if (carData.imageUrl) {
            carData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(carData.imageUrl)}`;
        }
        res.status(201).json(carData);
    } else {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Gagal menghapus file yang diunggah:", err);
            });
        }
        res.status(400);
        throw new Error('Data mobil tidak valid.');
    }
});

// @desc    Update a car for the logged-in user
// @route   PUT /api/cars/:id
// @access  Private (User)
const updateCar = asyncHandler(async (req, res) => {
    const { make, model, year, licensePlate, color } = req.body;
    const newImageUrl = req.file ? req.file.path : null; // Ambil path file baru dari multer

    const car = await Car.findOne({
        where: {
            carId: req.params.id,
            userId: req.user.id
        }
    });

    if (car) {
        // Cek jika plat nomor diubah dan sudah ada di mobil lain
        if (licensePlate && licensePlate !== car.licensePlate) {
            const existingCarWithNewLicense = await Car.findOne({ where: { licensePlate } });
            if (existingCarWithNewLicense && existingCarWithNewLicense.carId !== car.carId) {
                // Jika ada file baru diunggah tapi validasi gagal, hapus file baru tersebut
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error("Gagal menghapus file yang diunggah:", err);
                    });
                }
                res.status(400);
                throw new Error('Plat nomor ini sudah digunakan oleh mobil lain.');
            }
        }

        // Hapus gambar lama jika ada gambar baru yang diunggah
        if (newImageUrl && car.imageUrl) {
            fs.unlink(car.imageUrl, (err) => {
                if (err) console.error("Gagal menghapus gambar lama:", err);
            });
        }

        car.make = make || car.make;
        car.model = model || car.model;
        car.year = (year === '' || year === null) ? null : parseInt(year, 10) || car.year;
        car.licensePlate = licensePlate || car.licensePlate;
        car.color = color || car.color;
        car.imageUrl = newImageUrl || car.imageUrl; // Simpan path gambar baru, atau pertahankan yang lama jika tidak ada yang baru diunggah

        const updatedCar = await car.save();

        const carData = updatedCar.toJSON();
        if (carData.imageUrl) {
            carData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(carData.imageUrl)}`;
        }
        res.json(carData);
    } else {
        // Jika mobil tidak ditemukan, dan ada file baru diunggah, hapus file tersebut
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Gagal menghapus file yang diunggah:", err);
            });
        }
        res.status(404);
        throw new Error('Mobil tidak ditemukan atau Anda tidak memiliki akses ke mobil ini.');
    }
});

// @desc    Delete a car for the logged-in user
// @route   DELETE /api/cars/:id
// @access  Private (User)
const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findOne({
        where: {
            carId: req.params.id,
            userId: req.user.id
        }
    });

    if (car) {
        // Hapus file gambar terkait jika ada
        if (car.imageUrl) {
            fs.unlink(car.imageUrl, (err) => {
                if (err) console.error("Gagal menghapus gambar mobil:", err);
            });
        }
        await car.destroy();
        res.json({ message: 'Mobil berhasil dihapus.' });
    } else {
        res.status(404);
        throw new Error('Mobil tidak ditemukan atau Anda tidak memiliki akses ke mobil ini.');
    }
});

module.exports = {
    getMyCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};
