const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paassportJWT = require('../middleware/passportJWT');

router.post('/addOrder',orderController.addOrder);
router.post('/getOrderNotslip',orderController.getOrderNotSlip);
router.put('/getOrderHaveslip',orderController.getOrderHaveSlip);
router.get('/getAllOrderHaveslip',orderController.getAllOrderHaveSlip);
router.put('/updateSlip',orderController.updateSlip);

module.exports = router;