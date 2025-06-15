// backend/routes/serviceTypeRoutes.js
const express = require('express');
const { getServiceTypes, getServiceTypeById, createServiceType, updateServiceType, deleteServiceType } = require('../controllers/ServiceTypeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getServiceTypes) // Public, karena informasi service types mungkin ingin ditampilkan di landing page
    .post(protect, authorizeRoles('admin'), createServiceType);

router.route('/:id')
    .get(getServiceTypeById) // Public
    .put(protect, authorizeRoles('admin'), updateServiceType)
    .delete(protect, authorizeRoles('admin'), deleteServiceType);

module.exports = router;