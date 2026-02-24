// config/db.js
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    constructor() {
        // Si ya existe una instancia, la devuelve (Singleton)
        if (!Database.instance) {
            this.sequelize = new Sequelize(
                process.env.SQL_DB,
                process.env.SQL_USER,
                process.env.SQL_PASS,
                {
                    host: process.env.SQL_HOST,
                    dialect: 'postgres',
                    port: process.env.SQL_PORT || 5432,
                    logging: false,
                }
            );
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect() {
        try {
            // 1. Conectar MongoDB (NoSQL)
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ MongoDB Conectado (Catálogo)');

            // 2. Conectar PostgreSQL (SQL)
            await this.sequelize.authenticate();
            console.log('✅ PostgreSQL Conectado (Transaccional)');

            // 3. Sincronizar modelos
            await this.sequelize.sync({ force: false, alter: true });
            console.log('📦 Modelos SQL sincronizados');

        } catch (error) {
            console.error('❌ Error fatal en las conexiones:', error);
            process.exit(1);
        }
    }
}

// Exportamos una única instancia "congelada"
const instance = new Database();
// Object.freeze(instance); // Opcional: evita que la instancia sea modificada
module.exports = instance;