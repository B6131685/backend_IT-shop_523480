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

//for admin
router.get('/getAllOrderHaveslip',orderController.getAllOrderHaveSlip);
router.put('/verifyPayment',orderController.verifyPayment);
router.get('/trueVerifyPayment',orderController.getAllOrderHaveSlipAndVerifyTrue);

module.exports = router;