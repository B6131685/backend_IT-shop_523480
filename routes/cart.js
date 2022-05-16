const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const paassportJWT = require('../middleware/passportJWT');

router.put('/updateCart',[paassportJWT.isLogin], cartController.updateQuantityProduct);
router.put('/getcart',[paassportJWT.isLogin], cartController.getCartByIDUser);
router.put('/replaceCart',[paassportJWT.isLogin], cartController.updateByReplaceCart);
router.get('/getcart/:id',[paassportJWT.isLogin], cartController.getManyCartByIDCart);

module.exports = router;