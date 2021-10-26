const express = require('express');
const userCtrl = require('../controllers/user-controller');
const shopCtrl = require('../controllers/shop-controller.js');

const router = express.Router();

router.route('/shop/:shop')
.get(shopCtrl.getShop);

router.route('/shop/:shop/:comp')
.get(shopCtrl.getComp)
.post(shopCtrl.setMinCat);

router.route('/category/:cat')
.get(shopCtrl.getCat);

router.route('/product/:product')
.get(shopCtrl.getProduct)

router.route('/search/:term')
.get(shopCtrl.getSearch)

router.route('/subTotal')
.post(shopCtrl.subTotal);

router.route('/latestProd')
.get(shopCtrl.getLatestItems);

router.route('/hotProd')
.get(shopCtrl.getHotestItems);

router.route('/mostBroughtProd')
.get(shopCtrl.getMostBroughtItems);

router.param('comp', shopCtrl.setComp);
router.param('shop', shopCtrl.setShop);
router.param('userId', userCtrl.userByID);
router.param('cat', shopCtrl.setCat);
router.param('product', shopCtrl.setProduct);
router.param('term', shopCtrl.setSearch);

module.exports = router;