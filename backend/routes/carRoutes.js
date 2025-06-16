// backend/routes/carRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const path = require('path'); // Import path untuk menentukan lokasi penyimpanan
const fs = require('fs'); // Import fs untuk memastikan direktori ada

const {
    getMyCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} = require('../controllers/CarController');
const { protect } = require('../middleware/authMiddleware');

// Pastikan folder uploads ada
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true }); // Buat folder recursive jika belum ada
    console.log(`Folder 'uploads' dibuat di: ${UPLOADS_DIR}`);
} else {
    console.log(`Folder 'uploads' sudah ada di: ${UPLOADS_DIR}`);
}


// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Multer: Memproses destinasi untuk file:', file.originalname); // DEBUG
        cb(null, UPLOADS_DIR); // Gunakan konstanta UPLOADS_DIR
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
        console.log('Multer: Menyimpan file sebagai:', filename); // DEBUG
        cb(null, filename);
    },
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
    console.log('Multer: Memeriksa fileFilter untuk mimetype:', file.mimetype); // DEBUG
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        console.log('Multer: File REJECTED - mimetype tidak diizinkan:', file.mimetype); // DEBUG
        cb(new Error('Hanya file gambar (JPG, JPEG, PNG, GIF) yang diizinkan!'), false);
    }
};

// Inisialisasi upload multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Batasi ukuran file hingga 5MB
});

// Middleware untuk menangani error dari multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Terlalu banyak file diunggah atau nama field tidak sesuai.' });
        }
        // General multer error
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Other errors (e.g., from fileFilter)
        return res.status(400).json({ message: err.message });
    }
    next(); // Lanjut ke error handler umum jika bukan error multer
});


// Rute untuk user: get all my cars, create new car, update car, delete car
router.route('/')
    .get(protect, getMyCars)
    // Gunakan middleware upload.single('carImage') untuk upload satu file dengan nama field 'carImage'
    .post(protect, upload.single('carImage'), createCar); // 'carImage' adalah nama field di FormData dari frontend

router.route('/:id')
    .get(protect, getCarById)
    // Gunakan middleware upload.single('carImage') juga untuk update
    .put(protect, upload.single('carImage'), updateCar) // 'carImage' adalah nama field di FormData dari frontend
    .delete(protect, deleteCar);

module.exports = router;
