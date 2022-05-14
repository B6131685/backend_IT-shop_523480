const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paassportJWT = require('../middleware/passportJWT');

router.post('/addOrder',orderController.addOrder);

module.exports = router;