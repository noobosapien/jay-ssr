const express = require('express');
const authCtrl = require('../controllers/auth-controller.js');
const adminCtrl = require('../controllers/admin-controller');

const router = express.Router();

router.route('/admin/shops')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getShops);

router.route('/admin/categories/:shop')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getCategories)
.post(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.addCategory)
.put(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.editCategory)
.delete(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.removeCategory);

router.route('/admin/minCategories/:category')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getMinorCategories)
.post(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.addMinorCategory)
.put(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.editMinorCategory)
.delete(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.removeMinorCategory);

router.route('/admin/products/:minCategory')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getProducts)
.post(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.addProduct)
.put(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.editProduct)
.delete(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.removeProduct);

router.route('/admin/product/:prod')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getProduct);

router.route('/admin/getminorcats/:minCatName')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getMinorCategoryNames);

router.route('/admin/getmincatname/:mincatid')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getMinCatNameWithId);

router.route('/admin/pdownload')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.pDownloadUpload);

router.route('/admin/pimage')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.pImageUpload);

router.route('/admin/neworders')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getNewOrders)
.put(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.putNewOrder);

router.route('/admin/allUsers')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getAllUsers);

router.route('/admin/userInfo/:customer')
.get(authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.getCustomer);

router.param('shop', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setShop);
router.param('category', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setCategory);
router.param('minCategory', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setMinCategory);
router.param('prod', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setProduct);
router.param('minCatName', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setMinCatNames);
router.param('mincatid', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setMinCatID);
router.param('customer', authCtrl.requireSignin, authCtrl.isAdmin, adminCtrl.setCustomer);

module.exports = router;