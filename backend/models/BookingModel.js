// backend/models/BookingModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');
const User = require('./UserModel');
const Car = require('./CarModel');
const ServiceType = require('./ServiceTypeModel');

const Booking = sequelize.define('Booking', {
    bookingId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        allowNull: false,
        // references: { model: 'users', key: 'userId' } // <<< HAPUS INI - Ditangani oleh asosiasi di bawah
    },
    carId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        allowNull: false,
        // references: { model: 'cars', key: 'carId' } // <<< HAPUS INI - Ditangani oleh asosiasi di bawah
    },
    serviceTypeId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        allowNull: false,
        // references: { model: 'service_types', key: 'serviceTypeId' } // <<< HAPUS INI - Ditangani oleh asosiasi di bawah
    },
    bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    bookingTime: {
        type: DataTypes.STRING,
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
    tableName: 'bookings', // Pastikan nama tabel
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
