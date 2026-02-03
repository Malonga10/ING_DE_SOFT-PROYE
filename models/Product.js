// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    specs: { type: mongoose.Schema.Types.Mixed }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);