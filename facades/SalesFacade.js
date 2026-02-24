// facades/SalesFacade.js
const { PhysicalStockStrategy, DigitalStockStrategy } = require('../strategies/StockStrategy');
const Order = require('../models/Order'); 
const Product = require('../models/Product');
const { sequelize } = require('../config/db'); // Usando tu Singleton

class SalesFacade {
    async processOrder(orderData) {
        const { productId, quantity, customerEmail, isDigital } = orderData;
        
        // Iniciamos la transacción (Atomicidad) [cite: 77]
        const t = await sequelize.transaction();

        // Aplicamos Strategy según el tipo de producto 
        const strategy = isDigital ? new DigitalStockStrategy() : new PhysicalStockStrategy();

        try {
            const product = await Product.findById(productId);
            if (!product) throw new Error('Producto no encontrado en MongoDB');

            // Validar según estrategia (Físico vs Digital)
            strategy.validate(product, quantity);

            // Guardar en PostgreSQL
            const newOrder = await Order.create({
                totalAmount: product.price * quantity,
                status: 'PAID',
                customerEmail: customerEmail
            }, { transaction: t });

            // Actualizar stock en MongoDB solo si no es digital
            if (!isDigital) {
                product.stock -= quantity;
                await product.save();
            }

            await t.commit();
            return { orderId: newOrder.id, product: product.name };

        } catch (error) {
            await t.rollback(); // Rollback manual para integridad [cite: 17, 79]
            throw error;
        }
    }
}

module.exports = new SalesFacade();