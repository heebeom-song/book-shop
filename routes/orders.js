const express = require('express');
const { getOrderDetail, getOrders, order } = require('../controller/OrderController');
const router = express.Router();

router.use(express.json());


router.get('/:id', getOrderDetail);


router.route('/')
.get(getOrders)
.post(order);

module.exports = router;