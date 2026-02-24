// controllers/orderController.js
const SalesFacade = require('../facades/SalesFacade');

const createOrder = async (req, res) => {
    try {
        // Delegamos TODA la complejidad a la Fachada
        const result = await SalesFacade.processOrder(req.body);
        
        res.status(201).json({
            message: 'Compra exitosa procesada con Patrones de Diseño',
            ...result
        });
    } catch (error) {
        // La Fachada ya se encargó del rollback, aquí solo informamos el error
        res.status(400).json({ 
            error: 'Error en la transacción', 
            details: error.message 
        });
    }
};

module.exports = { createOrder };