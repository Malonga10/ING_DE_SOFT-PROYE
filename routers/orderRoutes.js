// routers/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/controllersOrder');

router.post('/buy', createOrder);

module.exports = router;