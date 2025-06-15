// backend/models/ServiceTypeModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');

const ServiceType = sequelize.define('ServiceType', {
    serviceTypeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 total digit, 2 digit di belakang koma
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    }
}, {
    tableName: 'service_types',
    timestamps: true
});

module.exports = ServiceType;