const express = require("express");

const paymentCtrl = require('../controllers/payment-controller');
const authCtrl = require('../controllers/auth-controller');
const router = express.Router();


router.route('/cpi')
.post(authCtrl.requireSignin, paymentCtrl.createPaymentIntent);

router.route('/_cart')
.get(authCtrl.requireSignin, paymentCtrl.getCartFromUser)
.put(authCtrl.requireSignin, paymentCtrl.putCartToUser);

router.route('/viewOrder')
.get(authCtrl.requireSignin, paymentCtrl.viewOrder);

router.route('/postcode')
.get(paymentCtrl.getShipping);

module.exports = router;