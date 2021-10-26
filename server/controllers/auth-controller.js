const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/keys');
const passport = require('passport');

////////////////////////////////////////////////////////////////////////////////////////
//Google signin
////////////////////////////////////////////////////////////////////////////////////////

const googleSignin = passport.authenticate('google', {
        scope: ['profile', 'email']
    }
);


const googleCallback = passport.authenticate('google');

const googleAccessCallback = (accessToken, refreshToken, profile, done) => {
    // console.log('accessToken: ', accessToken);
    // console.log('refreshToken: ', refreshToken);
    // console.log('profile: ', profile);

    done();
}

const googleAfterCallback = (req, res, next) => {
    console.log('Here');
    res.redirect('http://localhost:3000/');
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


const signin = async (req, res ) => {

    try{

        let user = await User.findOne({ email: req.body.email});
        if(!user){
            return res.status('401').json({error: "User not found"});
        }
        if(!user.authenticate(req.body.password)){
            return res.status('401').json({
                error: "Email and password do not match"
            });
        }

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret);

        res.cookie('t', token, { expire: new Date() + 9999});
        return res.json({
            token,
            user: {
                _id: user._id
            }
        });
    }catch(e){
        return res.status('401').json({
            error: "Could not sign in"
        });
    }
}

const signout = (req, res ) => {
    res.clearCookie("t");
    return res.status('200').json({
        message: "signed out"
    });
}

const requireSignin = expressJwt({
    secret: config.jwtSecret || "secret",
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256']
});



const hasAuthorization = (req, res, next ) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!authorized){
        return res.status('403').json({
            error: "User is not authorized"
        });
    }
    next();
}

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.auth._id);
    const admin = user ? user.admin : undefined;

    if(!admin){
        return res.status('403').json({
            error: "User is not an admin"
        });
    }
    next();
}

module.exports = { signin,
    signout,
    requireSignin,
    hasAuthorization,
    isAdmin,
    googleSignin,
    googleCallback,
    googleAccessCallback,
    googleAfterCallback 
};