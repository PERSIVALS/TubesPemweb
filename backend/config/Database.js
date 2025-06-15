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
        // Synchronize all models (create tables if they don't exist)
        // BE CAREFUL with { force: true } in production, it will drop existing tables!
        // Use alter: true to update table structure without dropping data
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };