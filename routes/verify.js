const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');


router.get('/:id',verifyController.verifyUser);
// router.get('/:id',()=>{
//     console.log(req.params.uniqueString);
// });

module.exports = router;