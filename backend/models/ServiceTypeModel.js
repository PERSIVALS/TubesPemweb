// backend/models/ServiceTypeModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');

const ServiceType = sequelize.define('ServiceType', {
    serviceTypeId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Hanya satu unique key untuk name
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    }
}, {
    tableName: 'service_types', // Pastikan nama tabel
    timestamps: true
});

module.exports = ServiceType;
