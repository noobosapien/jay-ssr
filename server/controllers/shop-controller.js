const Shop = require('../models/shop-model');
const Category = require('../models/category-model');
const MinorCategory = require('../models/minor-category-model');
const Product = require('../models/product-model');
const dbInit = require('../helpers/dbInit');


const setShop = async (req, res, next, shop) => {
    try{
        let sh = await Shop.findOne({name: shop}).populate('categories').exec();
        // let category = await Shop.findOne({name: cat}).exec();
        
        if(!sh){
            return res.status('400').json({
                error: "Shop not found"
            });
        }
        req.shop = sh;
        // console.log("Shop: ", sh, "\n\n\n\n\n\n\n");
        next();
    }catch(e){
        return res.status('400').json({
            error: "Could not retieve category"
        });
    }
}

const getShop = async (req, res, next) => {
    res.json({
        shop: req.shop
    });
}

const setComp = async (req, res, next, comp) => {
    try{
        let cm = await Category.findOne({_id: comp}).populate('minorCategories', '_id category name').exec();
        // let category = await Shop.findOne({name: cat}).exec();
        if(!cm){
            return res.status('400').json({
                error: "Category not found"
            });
        }
        req.component = cm;
        // console.log("Componenet: ", cm, "\n\n\n\n\n\n\n");
        next();
    }catch(e){
        return res.status('400').json({
            error: "Could not retieve Category"
        });
    }
}

const getComp = (req, res, next) => {
    res.json({
        component: req.component
    })
}


const setMinCat = async (req, res, next) => {
    try{
        const minCats = req.body && req.body.minCats;
        const page = req.body && Number(req.body.page);
        const sort = req.body && req.body.sort;

        let items = new Array;
        var pages = 0;

        if(minCats instanceof Array){
            const array = [];
            
            minCats.forEach((mincat) => {
                return array.push(mincat._id);
            });

            var products = [];

            switch(sort){
                case 'Name': 
                    products = await Product.find({minorCat: {$in: array}}, null, {limit: 9, skip: 9 * (page-1)}).sort('name').exec();
                    break;
                case 'Price':
                    products = await Product.find({minorCat: {$in: array}}, null, {limit: 9, skip: 9 * (page-1)}).sort('price1.price').exec();
                    break;
                case 'Price1':
                    products = await Product.find({minorCat: {$in: array}}, null, {limit: 9, skip: 9 * (page-1)}).sort('-price1.price').exec();
                    break;
                case 'Popularity':
                    products = await Product.find({minorCat: {$in: array}}, null, {limit: 9, skip: 9 * (page-1)}).sort('-stock').exec();
                    break;
            }

            const count = await Product.countDocuments({minorCat: {$in: array}});

            pages = Math.trunc((count / 10) + 1);

            items.push({products});
        }
        
        res.json({
            minCats: items,
            pages
        });

    }catch(e){
        console.log(e)
        return res.status('400').json({
            error: "Could not retieve minor category"
        });
    }
    
}

const setCat = async (req, res, next, cat) => {
    try{
        let category = await Shop.findOne({name: cat}).populate('products').exec();
        // let category = await Shop.findOne({name: cat}).exec();
        if(!category){
            return res.status('400').json({
                error: "Category not found"
            });
        }
        req.category = category;
        
        next();
    }catch(e){
        return res.status('402').json({
            error: "Could not retieve category"
        });
    }
}

const getCat = async (req, res, next) => {
    res.json({
        category: req.category
    });
}

const setProduct = async (req, res, next, product) => {
    try{
        const prod = await Product.findById(product).populate('minorCat', 'name').exec();
        req.product = prod;
        
        next();
    }catch(e){
        console.log(e);
        res.json({
            e
        });
    }
}

const getProduct = async (req, res, next) => {
    res.json({
        product: req.product
    });
}

const addProduct = async (req, res, next) => {
    const product = req.body;

    try{

        const prod = await Product.create(product);

        if(!prod){
            res.json({
                message: "Could not create the product"
            });
        }

        const shop = await Shop.findById(product.category);
        await shop.products.push(prod);
        await shop.save();

        res.json({
            message: "Success"
        });
    }catch(e){
        res.json({
            e
        });
    }
}

const setSearch = async (req, res, next, term) => {

    try{
        const db = await dbInit.getMongoDB();
        const collection = db.collection("products");

        let search = await collection.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${term}`,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2
                        }
                    }
                }
            }
        ]).toArray();

        let result = [];

        search.forEach((item) => {
            result.push({
                _id: item._id,
                name: item.name,
            });
        });

        req.search = result;
        next();
    }catch(e){
        console.log(e);
        res.json({
            e
        });
    }
    
}

const getSearch = async (req, res, next) => {
    res.json({
        results: req.search
    });
}

const subTotal = async (req, res, next) => {
    try{
        var total = 0;
        var IDs = [];
        if(!(req.body.items instanceof Array)){
            return res.json({message: "Body not an array"});
        }

        for(var i = 0; i < req.body.items.length; i++){
            if(req.body.items[i]){

                const product = await Product.findById(req.body.items[i]._id);

                if(Number(req.body.items[i].amount) > 0 && Number(req.body.items[i].amount) < product.price1.lessThan){
                    total += Number(req.body.items[i].amount) * product.price1.price;
                }else if(Number(req.body.items[i].amount) >= product.price1.lessThan && 
                Number(req.body.items[i].amount) < product.price2.moreThan){
                    total += Number(req.body.items[i].amount) * product.price2.price;
                }else{
                    total += Number(req.body.items[i].amount) * product.price3.price;
                }
    
                IDs.push(req.body.items[i]._id);
            }
        }
    
        res.json({total, IDs});

    }catch(e){
        console.log(e);
        res.json({error: e});
    }
}

const getLatestItems = async (req, res, next) => {
    try{
        const latest = await Product.getLatest();
        return res.json(latest);
    }catch(e){
        return res.json(e);
    }
}

const getHotestItems = async (req, res, next) => {
    try{
        const hottest = await Product.getHottest();
        return res.json(hottest);
    }catch(e){
        res.json(e);
    }
}

const getMostBroughtItems = async (req, res, next) => {
    try{
        const most = await Product.getMostBrought();
        return res.json(most);
    }catch(e){
        res.json(e);
    }
}

module.exports = {
    setShop, 
    getShop, 
    getComp, 
    setComp, 
    setMinCat, 
    setCat, 
    getCat, 
    setProduct, 
    getProduct, 
    addProduct,
    setSearch,
    getSearch,
    subTotal,
    getLatestItems,
    getHotestItems,
    getMostBroughtItems
};