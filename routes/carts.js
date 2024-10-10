const express = require('express');
const { removeCartItem, getCartItems, addToCart } = require('../controller/CartController');
const router = express.Router();

router.use(express.json());



router.delete('/:id', removeCartItem);


router.route('/')
.get(getCartItems)
.post(addToCart)

module.exports = router;