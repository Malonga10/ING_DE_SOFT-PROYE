// config/db.js
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// --- 1. Conexión NoSQL (MongoDB) - IGUAL QUE ANTES ---
const connectNoSQL = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Conectado (Catálogo)');
    } catch (error) {
        console.error('❌ Error en MongoDB:', error);
        process.exit(1);
    }
};

// --- 2. Conexión SQL (PostgreSQL) - CAMBIO AQUÍ ---
const sequelize = new Sequelize(
    process.env.SQL_DB, 
    process.env.SQL_USER, 
    process.env.SQL_PASS, 
    {
        host: process.env.SQL_HOST,
        dialect: 'postgres', // <--- Importante: dialecto postgres
        port: process.env.SQL_PORT || 5432, // Puerto default de PG
        logging: false,
    }
);

const connectSQL = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Conectado (Transaccional)');
    } catch (error) {
        console.error('❌ Error en PostgreSQL:', error);
        process.exit(1);
    }
};

module.exports = { connectNoSQL, connectSQL, sequelize };