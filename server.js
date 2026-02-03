require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const { connectNoSQL, connectSQL, sequelize } = require('./config/db');

// Importar rutas
const orderRoutes = require('./routers/orderRoutes');

// --- IMPORTAR SEGURIDAD (NUEVO) ---
const checkApiKey = require('./middleware/security'); // <--- 1. Aquí traemos al guardia

const app = express();

// --- Middlewares ---
app.use(cors()); 
app.use(express.json()); 

// --- Función de Inicio del Servidor ---
const startServer = async () => {
    try {
        console.log('⏳ Iniciando servicios...');

        // 1. Conectar a MongoDB (No Relacional)
        await connectNoSQL();

        // 2. Conectar a PostgreSQL (Relacional)
        await connectSQL();

        // 3. Sincronizar modelos SQL
        await sequelize.sync({ force: false, alter: true });
        console.log('📦 Tablas SQL sincronizadas correctamente');

        // --- Rutas del API ---
        
        app.get('/', (req, res) => {
            res.send('🚀 API Híbrida (SQL + NoSQL) funcionando correctamente.');
        });

        // --- APLICAR SEGURIDAD AQUÍ (NUEVO) ---
        // Le decimos: "En la ruta /api/orders, PRIMERO revisa el ApiKey, y LUEGO deja pasar"
        app.use('/api/orders', checkApiKey, orderRoutes); // <--- 2. Aquí pusimos al guardia

        // Ruta de prueba (sin seguridad para facilitar pruebas rápidas)
        const Product = require('./models/Product');
        app.post('/api/test/create-product', async (req, res) => {
            try {
                const p = await Product.create({
                    name: "Laptop Gamer X1",
                    price: 1500.00,
                    stock: 10,
                    specs: { ram: "32GB", cpu: "Intel i9", color: "Negro Mate" } 
                });
                res.json({ msg: "Producto creado en Mongo", product: p });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });

        // --- Levantar el Puerto ---
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`\n🔥 Servidor listo en: http://localhost:${PORT}`);
            console.log(`👉 Prueba crear orden en: POST http://localhost:${PORT}/api/orders/buy`);
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar el servidor:', error);
    }
};

// Ejecutar la función de inicio
startServer();