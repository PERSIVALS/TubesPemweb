// backend/controllers/ServiceTypeController.js
const ServiceType = require('../models/ServiceTypeModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all service types
// @route   GET /api/service-types
// @access  Public (or Private if you want to restrict access)
const getServiceTypes = asyncHandler(async (req, res) => {
    const serviceTypes = await ServiceType.findAll();
    res.json(serviceTypes);
});

// @desc    Get single service type by ID
// @route   GET /api/service-types/:id
// @access  Public (or Private)
const getServiceTypeById = asyncHandler(async (req, res) => {
    const serviceType = await ServiceType.findByPk(req.params.id);

    if (serviceType) {
        res.json(serviceType);
    } else {
        res.status(404);
        throw new Error('Service type not found');
    }
});

// @desc    Create new service type
// @route   POST /api/service-types
// @access  Private/Admin
const createServiceType = asyncHandler(async (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !price) {
        res.status(400);
        throw new Error('Please add all required fields: name and price');
    }

    // Cek apakah service type dengan nama ini sudah ada
    const serviceTypeExists = await ServiceType.findOne({ where: { name } });
    if (serviceTypeExists) {
        res.status(400);
        throw new Error('Service type with this name already exists');
    }

    const serviceType = await ServiceType.create({
        name,
        description: description || '',
        price
    });

    if (serviceType) {
        res.status(201).json(serviceType);
    } else {
        res.status(400);
        throw new Error('Invalid service type data');
    }
});

// @desc    Update a service type
// @route   PUT /api/service-types/:id
// @access  Private/Admin
const updateServiceType = asyncHandler(async (req, res) => {
    const serviceType = await ServiceType.findByPk(req.params.id);

    if (serviceType) {
        serviceType.name = req.body.name || serviceType.name;
        serviceType.description = req.body.description || serviceType.description;
        serviceType.price = req.body.price || serviceType.price;

        const updatedServiceType = await serviceType.save();
        res.json(updatedServiceType);
    } else {
        res.status(404);
        throw new Error('Service type not found');
    }
});

// @desc    Delete a service type
// @route   DELETE /api/service-types/:id
// @access  Private/Admin
const deleteServiceType = asyncHandler(async (req, res) => {
    const serviceType = await ServiceType.findByPk(req.params.id);

    if (serviceType) {
        await serviceType.destroy();
        res.json({ message: 'Service type removed' });
    } else {
        res.status(404);
        throw new Error('Service type not found');
    }
});

module.exports = {
    getServiceTypes,
    getServiceTypeById,
    createServiceType,
    updateServiceType,
    deleteServiceType
};