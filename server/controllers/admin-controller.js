const Shop = require('../models/shop-model');
const Category = require('../models/category-model');
const MinorCategory = require('../models/minor-category-model');
const Product = require('../models/product-model');
const Order = require('../models/order-model');
const User = require('../models/user-model');

const _ = require('lodash');
const keys = require('../config/keys');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fs = require('fs');

const getShops = async (req, res, next) => {
    const shops = await Shop.find({});
    var result = [];

    shops.forEach(shop => {
        result.push({
            _id: shop._id,
            name: shop.name
        });
    });

    res.json({shops: result});
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Category//
/////////////////////////////////////////////////////////////////////////////////////////////////

const getCategories = async (req, res, next) => {
    try{
        // const categories = await Category.find({shop: req.query.shop});
        const categories = await Category.find({shop: req.shop});
        var results = [];
    
        categories.forEach((category) => {
            results.push({
                _id: category._id,
                name: category.name
            });
        });
    
        res.json({categories: results});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const addCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }
        const available = await Category.find({name: req.body.name});
        
        if(available.length !== 0 && available[0].shop === req.body.shop){
            return res.json({
                message: "Category already exist"
            });
        }

        const shop = await Shop.find({_id: req.body.shop});
        if(shop.length === 0)   return res.json({message: "Shop doesn't exist"});

        const category = await Category.create({
            name: req.body.name,
            shop: req.body.shop
        });
        
        await shop[0].categories.push(category);
        await shop[0].save();

        res.json({message: "Success"});

    }catch(e){
        res.json({
            error: e
        });
    }
    
}

const removeCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }

        const category = await Category.find({_id: req.body._id});

        if(category.length === 0){
            return res.json({
                message: "Category does not exist"
            });
        }

        const shop = await Shop.find({_id: category[0].shop});
        if(shop.length === 0)   return res.json({message: "Shop doesn't exist"});
        
        await shop[0].categories.pull(category[0]);
        await shop[0].save();

        // await Shop.updateOne({cn: req.body.shop}, {$pullAll: {uid: [category]}});

        //delete everything in minor categories of the category
        for(var i = 0; i < category[0].minorCategories.length; i++){
            const minCat = await MinorCategory.find({_id: category[0].minorCategories[i]});

            await Product.deleteMany({minorCat: minCat[0]._id});

            // for(var j = 0; j < minCat[0].products.length; j++){
            //     const product = await Product.find({_id: minCat[0].products[j]});
            //     // await product[0].delete();
            // }

            // await minCat[0].delete();
        }

        MinorCategory.deleteMany({category: category[0]._id});

        await category[0].delete();

        res.json({message: "Success"});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const editCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }
        
        var body = {};
        const category = await Category.find({name: req.body.name});

        if(category.length === 0) {
            return res.json({message: "Category not found"});
        }

        if(req.body.newShop && req.body.newShop !== ""){
            const newShop = await Shop.find({_id: req.body.newShop});
            if(newShop.length === 0) return res.json({message: "New shop not found"});

            const shop = await Shop.find({_id: category[0].shop});
            await shop[0].categories.pull(category[0]);
            await shop[0].save();

            await newShop[0].categories.push(category[0]);
            await newShop[0].save();

            body.shop = req.body.newShop;
        }

        if(req.body.newName && req.body.newName !== ""){
            body.name = req.body.newName;
        }

        await Category.updateOne({name: req.body.name}, body, (err, doc) => {
            if(err){
                res.json({message: err});
            }
        });

        res.json({message: "Success"});
    }catch(e){
        res.json({
            error: e
        });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Minor Category//
/////////////////////////////////////////////////////////////////////////////////////////////////

const getMinorCategories = async (req, res, next) => {
    try{
        const minCats = await MinorCategory.find({category: req.category});
        var results = [];
        minCats.forEach(minCat => {
            results.push({
                _id: minCat._id,
                name: minCat.name
            });
        });
    
        res.json({minorCategories: results});
    }catch(e){
        res.json({
            error: e
        });
    }
    
}

const addMinorCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }

        if(!req.body.name || !req.body.category) return res.json({message: "Include name and the category"});

        const available = await MinorCategory.find({
            name: req.body.name,
            category: req.body.category
        });
        
        if(available.length !== 0){
            return res.json({
                message: "Minor Category already exist"
            });
        }
        
        const category = await Category.find({_id: req.body.category});
        if(category.length === 0)   return res.json({message: "Category doesn't exist"});

        const minCategory = await MinorCategory.create({
            name: req.body.name,
            category: req.body.category
        });
    
        
        await category[0].minorCategories.push(minCategory);
        await category[0].save();

        res.json({message: "Success"});

    }catch(e){
        res.json({
            error: e
        });
    }
}

const removeMinorCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }
        const minCategory = await MinorCategory.find({_id: req.body._id});

        if(minCategory.length === 0){
            return res.json({
                message: "Minor category does not exist"
            });
        }

        const category = await Category.find({_id: minCategory[0].category});
        if(category.length === 0)   return res.json({message: "Category doesn't exist"});

        await category[0].minorCategories.pull(minCategory[0]);

        //delete products in minor categories
        await Product.deleteMany({minorCat: minCategory[0]._id});
        
        await minCategory[0].delete();

        res.json({message: "Success"});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const editMinorCategory = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }

        var body = {};
        const minCategory = await MinorCategory.find({_id: req.body.minCat});

        if(minCategory.length === 0) {
            return res.json({message: "Minor category not found"});
        }

        if(req.body.newCategory && req.body.newCategory !== ""){
            const newCategory = await Category.find({_id: req.body.newCategory});
            if(newCategory.length === 0) return res.json({message: "New Category not found"});

            const category = await Category.find({_id: minCategory[0].category});
            await category[0].minorCategories.pull(minCategory[0]);
            await category[0].save();

            await newCategory[0].minorCategories.push(minCategory[0]);
            await newCategory[0].save();

            body.category = req.body.newCategory;
        }

        if(req.body.newName && req.body.newName !== ""){
            body.name = req.body.newName;
        }

        await MinorCategory.updateOne({_id: req.body.minCat}, body, (err, doc) => {
            if(err){
                res.json({message: err});
            }
        });

        res.json({message: "Success"});
    }catch (e){
        res.json({
            error: e
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Product//
/////////////////////////////////////////////////////////////////////////////////////////////////

const getProduct = async(req, res, next) => {
    try{
        const product = await Product.find({_id: req.product});
        if(product.length === 0){
            return res.json({
                message: "No product found"
            });
        }

        return res.json({product: product[0]});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const getProducts = async (req, res, next) => {
    try{
        const products = await Product.find({minorCat: req.minCat});
        const minCategory = await MinorCategory.find({_id: req.minCat});

        var results = [];
    
        if(products){
                products.forEach(product => {
                results.push({
                    _id: product._id,
                    name: product.name,
                });
            });
        }

        res.json({products: results});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const addProduct = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }

        if(!req.body.name || req.body.name === "" 
        || !req.body.uid || req.body.uid === "" 
        || !req.body.minorCat || req.body.minorCat === ""
        || !req.body.image || req.body.image === ""
        || !req.body.otherImages || req.body.otherImages === ""
        || !req.body.stock || req.body.stock === ""
        || !req.body.price1 || req.body.price1 === ""
        || !req.body.price2 || req.body.price2 === ""
        || !req.body.price3 || req.body.price3 === ""
        || !req.body.downloads || req.body.downloads === ""
        || !req.body.variables || req.body.variables === ""
        ){
            return res.json({
                message: "Comepete all fields of product"
            });
        }

        var body = {};

        if(req.body && req.body.description){
            body.description = req.body.description;
        }

        if(/^[a-zA-Z0-9\s())]+$/.test(req.body.uid)){
            body.uid = req.body.uid;
        }

        if(/^[a-zA-Z0-9\s())]+$/.test(req.body.name)){
            body.name = req.body.name;
        }

        const minCat = await MinorCategory.find({_id: req.body.minorCat}).populate('products');

        if(minCat.length === 0)
            return res.json({message: "Minor category does not exist"});
        else{
            for(var i = 0; i < minCat[0].products.length; i++){
                if(minCat[0].products[i].name === req.body.name){
                    return res.json({
                        message: "Product already exist"
                    });
                }
            }
            
            body.minorCat = req.body.minorCat;
        }

        if(/^https:\/\/jaytronics.s3/i.test(req.body.image))
            body.image = req.body.image;
        else
            return res.json({
                message: "Image invalid"
            });

        if(req.body.otherImages instanceof Array){
            body.otherImages = [];

            req.body.otherImages.forEach((img) => {
                if(/^https:\/\/jaytronics.s3/i.test(img)){
                    body.otherImages.push(img);
                }
            });
        }
        
        if(/^[0-9]+$/.test(req.body.stock))
            body.stock = req.body.stock;
        else
            body.stock = 0;
        
        //price 1
        body.price1 = {lessThan: 0, price: 0};
        body.price2 = {moreThan: 0, price: 0};
        body.price3 = {moreThan: 0, price: 0};

        if(/^[0-9]+$/.test(req.body.price1.lessThan)){
            body.price1.lessThan = req.body.price1.lessThan;
        }

        if(/^[0-9]+$/.test(req.body.price1.price)){
            body.price1.price = req.body.price1.price;
        }

        if(/^[0-9]+$/.test(req.body.price2.moreThan)){
            body.price2.moreThan = req.body.price2.moreThan;
        }

        if(/^[0-9]+$/.test(req.body.price2.price)){
            body.price2.price = req.body.price2.price;
        }

        if(/^[0-9]+$/.test(req.body.price3.moreThan)){
            body.price3.moreThan = req.body.price3.moreThan;
        }

        if(/^[0-9]+$/.test(req.body.price3.price)){
            body.price3.price = req.body.price3.price;
        }
        
        for(var i = 0; i < req.body.downloads.length; i++){
            if(/^https:\/\/jaytronics.s3/i.test(req.body.downloads[i].link))
                continue;
            else
                return res.json({
                    message: "Downloads invalid"
                });
        }
        body.downloads = [];
        req.body.downloads.forEach(download => body.downloads.push(download));

        body.variables = [];
        for(var i = 0; i < req.body.variables.length; i++){
            let variable = {};
            variable.parameter = req.body.variables[i].parameter;
            variable.value = req.body.variables[i].value;

            body.variables.push(variable);
        }

        const product = await Product.create(body);

        await minCat[0].products.push(product);
        await minCat[0].save();

        return res.json({
            message: "Success"
        });

    }catch(e){
        console.log(e);
        res.json({
            error: e
        });
    }
}

const removeProduct = async (req, res, next) => {
    try{
        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }
        const product = await Product.find({_id: req.body._id});

        if(product.length === 0){
            return res.json({
                message: "Product does not exist"
            });
        }

        const minCategory = await MinorCategory.find({_id: product[0].minorCat});
        if(minCategory.length === 0)   return res.json({message: "Minor category doesn't exist"});

        await minCategory[0].products.pull(product[0]);

        await product[0].delete();

        res.json({message: "Success"});
    }catch(e){
        res.json({
            error: e
        });
    }
}

const editProduct = async (req, res, next) => {
    try{

        if(_.isEmpty(req.body)){
            res.json({
                error: "No body"
            });
        }

        const product = await Product.find({_id: req.body._id});

        if(product.length === 0){
            return res.json({
                message: "Product not found"
            });
        }

        var body = {};

        if(req.body.newUid && req.body.newUid!=="" && /^[a-zA-Z0-9\s())]+$/.test(req.body.newUid)){
            body.uid = req.body.newUid;
        }

        if(req.body.newDescription && req.body.newDescription!==""){
            body.description = req.body.newDescription;
        }

        if(req.body.newName && req.body.newName!=="" && /^[a-zA-Z0-9\s())]+$/.test(req.body.newName)){
            body.name = req.body.newName;
        }

        if(req.body.newMinorCat && req.body.newMinorCat!==""){
            const minorCat = await MinorCategory.find({_id: product[0].minorCat});
            const newMinorCat = await MinorCategory.find({_id: req.body.newMinorCat});

            if(newMinorCat.length === 0){
                return res.json({
                    message: "Minor category not found"
                });
            }

            await minorCat[0].products.pull(product[0]);
            await newMinorCat[0].products.push(product[0]);
            await minorCat[0].save();
            await newMinorCat[0].save();

            body.minorCat = req.body.newMinorCat;
        }

        if(req.body.newImage && req.body.newImage !== "" && /^https:\/\/jaytronics.s3/i.test(req.body.newImage)){
            body.image = req.body.newImage;
        }

        body.otherImages =[];
        if(req.body.newOtherImages && req.body.newOtherImages !== "" && req.body.newOtherImages instanceof Array){
            req.body.newOtherImages.forEach((img) => {
                if(/^https:\/\/jaytronics.s3/i.test(img)){
                    body.otherImages.push(img);
                }
            });
        }

        if(req.body.newStock && req.body.newStock !== "" && /^[0-9]+$/.test(req.body.newStock)){
            body.stock = req.body.newStock;
        }

        if(req.body.newPrice1 && req.body.newPrice1 !== ""){

            body.price1 = {}

            if(!(/^[0-9]+$/.test(req.body.newPrice1.lessThan))){
                body.price1.lessThan = 0;
            }else{
                body.price1.lessThan = req.body.newPrice1.lessThan;
            }

            if(!(/^[0-9]+$/.test(req.body.newPrice1.price))){
                body.price1.price = 0;
            }else{
                body.price1.price = req.body.newPrice1.price;
            }
        }

        if(req.body.newPrice2 && req.body.newPrice2 !== ""){

            body.price2 = {}

            if(!(/^[0-9]+$/.test(req.body.newPrice2.moreThan))){
                body.price2.moreThan = 0;
            }else{
                body.price2.moreThan = req.body.newPrice2.moreThan;
            }

            if(!(/^[0-9]+$/.test(req.body.newPrice2.price))){
                body.price2.price = 0;
            }else{
                body.price2.price = req.body.newPrice2.price;
            }
        }

        if(req.body.newPrice3 && req.body.newPrice3 !== ""){

            body.price3 = {}

            if(!(/^[0-9]+$/.test(req.body.newPrice3.moreThan))){
                body.price3.moreThan = 0;
            }else{
                body.price3.moreThan = req.body.newPrice3.moreThan;
            }

            if(!(/^[0-9]+$/.test(req.body.newPrice3.price))){
                body.price3.price = 0;
            }else{
                body.price3.price = req.body.newPrice3.price;
            }
        }
        
        if(req.body.newDownloads && req.body.newDownloads != ""){
            
            for(var i = 0; i < req.body.newDownloads.length; i++){
                if(/^https:\/\/jaytronics.s3/i.test(req.body.newDownloads[i].link)){
                    continue;
                }
                else
                    return res.json({
                        message: "Downloads invalid"
                    });
            }

            body.downloads = [];

            req.body.newDownloads.forEach(download => body.downloads.push(download));
        }

        if(req.body.newVariables && req.body.newVariables !== ""){
            body.variables = [];
            for(var i = 0; i < req.body.newVariables.length; i++){
                let variable = {};
                variable.parameter = req.body.newVariables[i].parameter;
                variable.value = req.body.newVariables[i].value;

                body.variables.push(variable);
            }
        }

        await Product.updateOne({_id: req.body._id}, body, (err, doc) => {
            if(err){
                res.json({message: err});
            }
        });

        res.json({message: "Success"});

    }catch(e){
        res.json({
            error: e
        });
    }
}

const getMinorCategoryNames = async (req, res, next) => {
    try{
        //req.minCatName

        const minCat = await MinorCategory.find({_id: req.minCatName});

        if(minCat.length === 0){
            return res.json({
                message: "No minor category with that name"
            });
        }

        const category = await Category.find({_id: minCat[0].category}).populate('minorCategories', 'name');

        if(category.length === 0){
            return res.json({
                message: "No category with that id"
            });
        }

        return res.json({
            minorCatNames: category[0].minorCategories
        });

    }catch(e){
        res.json({
            error: e
        });
    }
}

const getMinCatNameWithId = async (req, res, next) => {
    try{
        const minCat = await MinorCategory.find({_id: req.mincatID});

        if(minCat.length === 0){
            return res.json({
                message: "No minor category with that id"
            });
        }

        return res.json({
            minorCatName: minCat[0].name
        });

    }catch(e){
        res.json({
            error: e
        });
    }
}


const s3 = new aws.S3({
    accessKeyId: keys.s3AccessKeyID,
    secretAccessKey: keys.s3SecretAccessKey,
    signatureVersion: 'v4',
    region: 'ap-southeast-2'
 });

const pDownloadUpload = async (req, res, next) => {
    const key = `downloads/${uuidv4()}.pdf`;

    s3.getSignedUrl('putObject', {
        Bucket: 'jaytronics',
        ContentType: 'application/pdf',
        Key: key
    }, (err, url) => {
        if(err)
            res.json({message: err});
        res.json({url, objLink: `https://jaytronics.s3.ap-southeast-2.amazonaws.com/${key}`});
    });
}

const pImageUpload = async (req, res, next) => {
    const key = `products/${uuidv4()}.png`;

    s3.getSignedUrl('putObject', {
        Bucket: 'jaytronics',
        ContentType: 'image/png',
        Key: key
    }, (err, url) => {
        if(err)
            res.json({message: err});
        res.json({url, objLink: `https://jaytronics.s3.ap-southeast-2.amazonaws.com/${key}`});
    });
}

//setters

const setShop = async (req, res, next, shop) => {
    req.shop = shop;
    next();
}

const setCategory = async (req, res, next, category) => {
    req.category = category;
    next();
}

const setMinCategory = async (req, res, next, minCat) => {
    req.minCat = minCat;
    next();
}

const setProduct = async (req, res, next, prod) => {
    req.product = prod;
    next();
}

const setMinCatNames = async (req, res, next, minCatName) => {
    req.minCatName = minCatName;
    next();
}

const setMinCatID = async (req, res, next, id) => {
    req.mincatID = id;
    next();
}


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Orders//
/////////////////////////////////////////////////////////////////////////////////////////////////

const getNewOrders = async (req, res, next) => {
    try{
        const result = await Order.find({
            status: "Processing"
        });

        var orders = [];

        if(result instanceof Array){

            for(var i = 0; i < result.length; i++){
                orders.push(result[i]);
            }

        }
        
        return res.json({
            orders
        });

    }catch(e){
        return res.json({
            message: "An error occured while retrieving new orders"
        });
    }
}

const putNewOrder = async (req, res, next) => {
    try{
        if(req.body){
            const order = await Order.findById(req.body._id);
            order.status = "Shipped";
            await order.save();

            res.json({
                error: false,
            });
        }

    }catch(e){
        return res.json({
            message: "An error occured while updating the order"
        });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Users//
/////////////////////////////////////////////////////////////////////////////////////////////////

const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find({}).select('_id');

        return res.json({
            customers: users
        });

    }catch(e){
        return res.json({e});
    }

}

const setCustomer = async (req, res, next, customer) => {
    req.customer = customer;
    next();
}

const getCustomer = async (req, res, next) => {
    try{
        const user = await User.findById({_id: req.customer}).select('firstName lastName email admin orders created address billingAddress');

        return res.json({
            customer: user
        });

    }catch(e){
        return res.json({
            e
        });
    }
}

module.exports = {
    getShops,
    getCategories,
    addCategory,
    removeCategory,
    editCategory,
    getMinorCategories,
    addMinorCategory,
    removeMinorCategory,
    editMinorCategory,
    getProduct,
    getProducts,
    addProduct,
    removeProduct,
    editProduct,
    getMinorCategoryNames,
    setShop,
    setCategory,
    setMinCategory,
    setProduct,
    setMinCatNames,
    getMinCatNameWithId,
    pDownloadUpload,
    pImageUpload,
    setMinCatID,

    getNewOrders,
    putNewOrder,

    getAllUsers,
    setCustomer,
    getCustomer
}