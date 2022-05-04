const express = require('express');
const router = express.Router();

const ShopPageController = require('../controllers/shopPageController');

router.get('/getShopPage', ShopPageController.getshopPage);
router.put('/pushImgToShopPage', ShopPageController.addImgShopPage);
router.put('/deleteImgFromShopPage', ShopPageController.destroy);
router.put('/editNameShop', ShopPageController.editNameShop);

module.exports = router;