// backend/config/Database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false, // Set to true to see SQL queries in console
        // 'define' property was removed by the user in a previous update, keeping it as is.
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQL Database Connected Successfully!');
        // Import models here if not already imported in server.js to ensure they are defined
        require('../models/UserModel');
        require('../models/CarModel');
        require('../models/ServiceTypeModel');
        require('../models/BookingModel');

        // *** PENTING: GUNAKAN { force: true } UNTUK DEBUGGING INI ***
        // Ini akan menghapus tabel yang ada dan membuatnya kembali dari nol.
        // JANGAN PERNAH DIGUNAKAN DI PRODUKSI!
        await sequelize.sync({ force: true }); // <--- UBAH DI SINI!
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
