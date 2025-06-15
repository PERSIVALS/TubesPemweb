// backend/models/CarModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');
const User = require('./UserModel'); // Import User model untuk relasi

const Car = sequelize.define('Car', {
    carId: {
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
            model: User, // Foreign key ke tabel User
            key: 'userId'
        }
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
        allowNull: true,
        validate: {
            min: 1900,
            max: new Date().getFullYear() + 1 // Tahun maksimal bisa tahun sekarang + 1
        }
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'cars',
    timestamps: true
});

// Definisikan relasi (1 User punya banyak Cars)
User.hasMany(Car, { foreignKey: 'userId', as: 'cars' });
Car.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Car;