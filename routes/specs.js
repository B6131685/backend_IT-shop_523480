var express = require('express');
var router = express.Router();
const specController = require('../controllers/specController')

router.post('/addSpec',specController.addSpecs);
router.get('/getSpec',specController.getSpecs);
router.delete('/deleteSpec/:_id',specController.destroy);
router.delete('/deleteSpecAndProduct/:_id',specController.destroyMany);
router.put('/updateSpec/:_id',specController.updateByOne);

module.exports = router;