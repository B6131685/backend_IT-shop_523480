var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController')
const paassportJWT = require('../middleware/passportJWT');
/* GET home page. */
router.post('/addProduct',[paassportJWT.isLogin], productController.addProduct);
router.get('/getallProduct',[paassportJWT.isLogin], productController.getAllProduct);
router.put('/updateProductStock',[paassportJWT.isLogin], productController.updateProductStock);

module.exports = router;
