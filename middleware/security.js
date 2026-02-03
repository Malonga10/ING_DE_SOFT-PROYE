// middleware/security.js
require('dotenv').config();

const checkApiKey = (req, res, next) => {
    // 1. Obtener la clave que manda Python
    const claveCliente = req.headers['x-api-key'];
    
    // 2. Obtener la clave real del .env
    const claveServidor = process.env.API_KEY;

    // --- IMPRIMIR EN CONSOLA PARA VER QUÉ PASA ---
    console.log('\n👮 --- REVISIÓN DE SEGURIDAD ---');
    console.log(`🔑 Python envió:   "${claveCliente}"`);
    console.log(`🔐 Servidor espera: "${claveServidor}"`);

    // 3. Comparar
    if (claveCliente && claveCliente === claveServidor) {
        console.log('✅ ¡Coinciden! Pase adelante.');
        next(); // Deja pasar
    } else {
        console.log('⛔ ¡No coinciden! Bloqueando acceso.');
        res.status(403).json({ error: 'Acceso denegado: Clave incorrecta' });
    }
};

module.exports = checkApiKey;