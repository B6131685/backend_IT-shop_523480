const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const paassportJWT = require('../middleware/passportJWT');

router.put('/updateCart',[paassportJWT.isLogin], cartController.updateQuantityProduct);
router.put('/getcart',[paassportJWT.isLogin], cartController.getCartByID);

module.exports = router;