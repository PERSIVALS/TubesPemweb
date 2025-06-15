// backend/models/BookingModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');
const User = require('./UserModel');
const Car = require('./CarModel');
const ServiceType = require('./ServiceTypeModel');

const Booking = sequelize.define('Booking', {
    bookingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'userId'
        }
    },
    carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Car,
            key: 'carId'
        }
    },
    serviceTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: ServiceType,
            key: 'serviceTypeId'
        }
    },
    bookingDate: {
        type: DataTypes.DATEONLY, // Format YYYY-MM-DD
        allowNull: false
    },
    bookingTime: {
        type: DataTypes.STRING, // Misalnya "09:00", "14:30"
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

// Definisikan relasi
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Car.hasMany(Booking, { foreignKey: 'carId', as: 'bookings' });
Booking.belongsTo(Car, { foreignKey: 'carId', as: 'car' });

ServiceType.hasMany(Booking, { foreignKey: 'serviceTypeId', as: 'bookings' });
Booking.belongsTo(ServiceType, { foreignKey: 'serviceTypeId', as: 'serviceType' });

module.exports = Booking;