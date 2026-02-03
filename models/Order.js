// models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true } 
    }
});

module.exports = Order;