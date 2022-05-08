const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const paassportJWT = require('../middleware/passportJWT');

router.put('/updateCart',[paassportJWT.isLogin], cartController.updateQuantityProduct);
router.put('/getcart',[paassportJWT.isLogin], cartController.getCartByID);
router.put('/replaceCart',[paassportJWT.isLogin], cartController.updateByReplaceCart);

module.exports = router;