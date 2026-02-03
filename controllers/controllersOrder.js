// controllers/orderController.js
const Product = require('../models/Product'); 
const Order = require('../models/Order');     
const { sequelize } = require('../config/db'); 

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { productId, quantity, customerEmail } = req.body;

        const product = await Product.findById(productId);
        
        if (!product) {
            await t.rollback(); 
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            await t.rollback();
            return res.status(400).json({ error: 'No hay suficiente stock' });
        }

        const total = product.price * quantity;
        
        const newOrder = await Order.create({
            totalAmount: total,
            status: 'PAID',
            customerEmail: customerEmail
        }, { transaction: t }); 


        product.stock = product.stock - quantity;
        await product.save();

        await t.commit();

        res.status(201).json({
            message: 'Compra exitosa',
            orderId: newOrder.id,
            product: product.name,
            newStock: product.stock
        });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error procesando la compra', details: error.message });
    }
};

module.exports = { createOrder };