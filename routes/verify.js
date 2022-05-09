const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');


router.get('/:id',verifyController.verifyUser);
router.get('/verifyNewEmail/:uniqueString',verifyController.verifyNewEmail);

module.exports = router;