const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paassportJWT = require('../middleware/passportJWT');

router.post('/addOrder',orderController.addOrder);
router.post('/getOrderNotslip',orderController.getOrderNotSlip);
router.put('/getOrderHaveslip',orderController.getOrderHaveSlip);
router.delete('/cancleOrder/:id',orderController.cancleOrder);
router.put('/updateSlip',orderController.updateSlip);
router.get('/getOrderNotActive/:id',orderController.getOrderNotActive);
router.get('/getOrderDisapprove/:id',orderController.getOrderDisapprove);
router.get('/orderPDF/:id',orderController.orderPDF);

//for both
router.get('/getAllOrderHaveAlreadySend',orderController.getAllOrderHaveAlreadySend);

//for admin
router.get('/getAllOrderHaveslip',orderController.getAllOrderHaveSlip);
router.put('/verifyPayment',orderController.verifyPayment);
router.put('/trackingOrder',orderController.updateIDTracking);
router.get('/trueVerifyPayment',orderController.getAllOrderHaveSlipAndVerifyTrue);

module.exports = router;