var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController')
const paassportJWT = require('../middleware/passportJWT');
/* GET home page. */
router.post('/addProduct',[paassportJWT.isLogin], productController.addProduct);
router.get('/getallProduct', productController.getAllProduct);
router.put('/updateProductStock',[paassportJWT.isLogin], productController.updateProductStock);
router.get('/getProductOne/:_id',[paassportJWT.isLogin], productController.getProductByID);
router.put('/updateProductOne',[paassportJWT.isLogin], productController.updateByOne);
router.delete('/deleteProduct/:_id',[paassportJWT.isLogin],productController.destroy);

module.exports = router;
