const express = require('express');
const router = express.Router();

const ShopPageController = require('../controllers/shopPageController');

router.get('/getShopPage', ShopPageController.getshopPage);
router.put('/pushImgToShopPage', ShopPageController.addImgShopPage);
router.put('/deleteImgFromShopPage', ShopPageController.destroy);

module.exports = router;