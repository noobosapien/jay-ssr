const express = require("express");
const webhookCtrl = require('../controllers/webhook-controller');

const router = express.Router();

router.route('/stripeWH')
.post(express.raw({type: 'application/json'}), webhookCtrl.stripeWebHook);

module.exports = router;