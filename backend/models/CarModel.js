// backend/models/CarModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');
const User = require('./UserModel'); // Import UserModel untuk asosiasi

const Car = sequelize.define('cars', { // Nama tabel 'cars'
    carId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.CHAR(36), // Konsisten CHAR(36) untuk UUID
        allowNull: false,
        // references: { model: 'users', key: 'userId' } // <<< HAPUS INI - Ditangani oleh asosiasi di bawah
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Hanya satu unique key untuk licensePlate
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    freezeTableName: true, // Nama tabel tidak diubah Sequelize
    timestamps: true
});

// Definisikan asosiasi
Car.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Car, { foreignKey: 'userId', as: 'cars', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Car;
