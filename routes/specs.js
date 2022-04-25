var express = require('express');
var router = express.Router();
const specController = require('../controllers/specController')

router.post('/addSpec',specController.addSpecs);
router.get('/getSpec',specController.getSpecs);
router.delete('/deleteSpec/:_id',specController.destroy);
router.put('/updateSpec/:_id',specController.updateByOne);

module.exports = router;