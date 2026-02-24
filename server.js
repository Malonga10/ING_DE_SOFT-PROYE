// server.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 

// IMPORTANTE: Ahora importamos la instancia Singleton de la base de datos
const db = require('./config/db'); 

// Importar rutas
const orderRoutes = require('./routers/orderRoutes');

// Importar Middleware de Seguridad
const checkApiKey = require('./middleware/security'); 

const app = express();

// --- Middlewares ---
app.use(cors()); 
app.use(express.json()); 

// --- Función de Inicio del Servidor ---
const startServer = async () => {
    try {
        console.log('⏳ Iniciando servicios con Patrón Singleton...');

        // El Singleton gestiona internamente la conexión a MongoDB, 
        // PostgreSQL y la sincronización de modelos.
        await db.connect(); 

        // --- Rutas del API ---
        app.get('/', (req, res) => {
            res.send('🚀 API PolyStore Refactorizada (Singleton + Seguridad) funcionando.');
        });

        // Aplicar seguridad en las rutas de órdenes
        app.use('/api/orders', checkApiKey, orderRoutes);

        // --- Levantar el Puerto ---
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`\n🔥 Servidor listo en: http://localhost:${PORT}`);
            console.log(`👉 Rutas protegidas por API Key activadas.`);
        });

    } catch (error) {
        // El Singleton propaga el error aquí si alguna DB falla
        console.error('❌ Error fatal al iniciar el servidor:', error);
        process.exit(1); 
    }
};

// Ejecutar la función de inicio
startServer();