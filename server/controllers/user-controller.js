const User = require('../models/user-model');
const Order = require('../models/order-model');
const extend = require('lodash/extend');
const errorHandler = require('../helpers/dbErrorHandler');

//need for registering
const create = async (req, res, next) => {
    try{
        req.body.admin = false;
        const user = new User(req.body);

        await user.save();

        return res.status(200).json({
            error: false,
            message: "Successfully signed up!"
        });
    }catch(e){
        return res.status(400).json({
            error: true,
            message: errorHandler.getErrorMessage(e)
        })
    }
}

//need for admin
const list = async (req, res) => {
    try{
        let users = await User.find().select('name email updated created');
        res.json(users);
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

//need for admin and profile
const userByID = async (req, res, next, id) => {
    try{
        let user = await User.findById(id);
        if(!user){
            return res.status('400').json({
                error: "User not found"
            });
        }
        req.profile = user;

        next();
    }catch(e){
        return res.status('400').json({
            error: "Could not retrieve user"
        });
    }
}

//need for admin and profile
const read = async (req, res) => {
    try{
        if(req.auth){
            const user = await User.findById(req.auth._id);
            const obj = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
    
            return res.json(obj);
        }
        return res.json({
            firstName: "",
            lastName: "",
            email: ""
        });
    }catch(e){
        res.json({
            e
        });
    }
}

//need for profile
const update = async (req, res, next) => {
    try{
        if(req.auth && req.body){
            const user = await User.findById(req.auth._id);

            const obj = {
                firstName: req.body.firstName ? req.body.firstName : user.firstName,
                lastName: req.body.lastName ? req.body.lastName : user.lastName,
                email: req.body.email ? req.body.email : user.email
            }

            await User.updateOne({_id: req.auth._id}, obj);

            if(req.body.password){
                // await User.updateOne({_id: req.auth._id}, {password: req.body.password});
                user.password = req.body.password;
                await user.save();
            }

            return res.json({error: false, message: "Success"});
        }
        return res.json({error: true, message: "Fail"});

    }catch(e){
        return res.json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

//need for profile
const remove = async (req, res, next) => {
    try{
        let user = req.profile;
        let deleteUser = await user.remove();
        deleteUser.hashed_password = undefined;
        deleteUser.salt = undefined;
        res.json(deleteUser);
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

const getUserAddress = async (req, res, next) => {
    try{
        const user = await User.findById(req.auth);
        res.json({address: user.address});
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

const setUserAddress = async (req, res, next) => {
    try{
        const user = await User.findById(req.auth);
        const address = {address: req.body.address};
        // const postCode = req.body.pc;
        // console.log(address);
        
        await User.updateOne({_id: user._id}, address, (err, doc) => {
            if(err){
                res.json(err);
            }
        });

        res.json({address});
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}


const getUserBillingAddress = async (req, res, next) => {
    try{
        const user = await User.findById(req.auth);
        res.json({address: user.billingAddress});
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

const setUserBillingAddress = async (req, res, next) => {
    try{
        const user = await User.findById(req.auth);
        const address = {billingAddress: req.body.address};
        
        await User.updateOne({_id: user._id}, address, (err, doc) => {
            if(err){
                res.json(err);
            }
        });

        res.json({address});
    }catch(e){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(e)
        });
    }
}

const getOrders = async (req, res, next) => {
    const user = await User.findOne({_id: req.auth._id});

    if(!user){
        return res.json({
            message: "User was not found"
        });
    }

    return res.json({
        orders: [...user.orders].reverse()
    });
}

const getOrderDetails = async (req, res, next) => {
    const order = await Order.findOne({_id: req.query._id, customer: req.auth._id});
    
    if(!order){
        return res.json({
            message: "Order was not found"
        });
    }

    return res.json({
        order
    });
}

const isAnAdmin = async (req, res, next) => {
    const user = await User.findById(req.auth._id);

    if(user && user.admin){
        return res.json({
            admin: true
        });
    }else{
        return res.json({
            admin: false
        });
    }
}

module.exports = { 
    create, 
    list, 
    userByID, 
    read, 
    remove, 
    update, 
    getUserAddress, 
    getUserBillingAddress, 
    setUserAddress, 
    setUserBillingAddress,
    getOrders,
    getOrderDetails,
    isAnAdmin
};