const express = require('express');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();

router.route('/auth/signin').post(authCtrl.signin);
router.route('/auth/signout').get(authCtrl.signout);

//Google
router.route('/auth/google').get(authCtrl.googleSignin);
router.route('/auth/google/callback').get(authCtrl.googleCallback, authCtrl.googleAfterCallback);

module.exports = router;