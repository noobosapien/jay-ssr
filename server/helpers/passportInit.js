const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require('../controllers/auth-controller');
const config = require('../config/keys');


passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: '/auth/google/callback'
    // callbackURL: 'http://localhost:3000/'
}, authController.googleAccessCallback));
