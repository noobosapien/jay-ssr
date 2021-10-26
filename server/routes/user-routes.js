const express = require('express');
const userCtrl = require('../controllers/user-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();

router.route('/api/users')
.get(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.list)
.post(userCtrl.create);

router.route('/api/isAdmin')
.get(authCtrl.requireSignin, userCtrl.isAnAdmin);

router.route('/api/profile')
.get(authCtrl.requireSignin, userCtrl.read)
.put(authCtrl.requireSignin, userCtrl.update)
.delete(authCtrl.requireSignin, userCtrl.remove);

router.route('/api/userAddress')
.get(authCtrl.requireSignin, userCtrl.getUserAddress)
.post(authCtrl.requireSignin, userCtrl.setUserAddress);

router.route('/api/userBillingAddress')
.get(authCtrl.requireSignin, userCtrl.getUserBillingAddress)
.post(authCtrl.requireSignin, userCtrl.setUserBillingAddress);

router.route('/api/getOrders')
.get(authCtrl.requireSignin, userCtrl.getOrders);

router.route('/api/getOrderDetails')
.get(authCtrl.requireSignin, userCtrl.getOrderDetails);

router.param('userId', userCtrl.userByID);

module.exports = router;
