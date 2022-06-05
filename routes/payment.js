const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/addPayment', paymentController.addPayment);
router.put('/editPayment', paymentController.editPayment);
router.get('/getPayment', paymentController.getPayment);

module.exports = router;