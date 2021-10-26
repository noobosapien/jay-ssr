const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: 'UID is required',
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        trim: true,
        required: 'Name of the category is required'
    },
    minorCat: {
        type: mongoose.Types.ObjectId,
        ref: 'MinorCategory'
    },
    image: {
        type: String, //s3 address
    },
    otherImages: [{
        type: String
    }],
    description: String,
    stock: {
        type: Number
    },
    downloads: [{
        link: String,
        name: String
    }],
    price1: {
        price: Number,
        lessThan: Number
    },
    price2: {
        price: Number,
        moreThan: Number
    },
    price3: {
        price: Number,
        moreThan: Number
    },
    variables: [{
        parameter: String,
        value: String
    }],
    specs: [{
        parameter: String,
        value: String
    }],
    brought: Number
});

ProductSchema.statics.getLatest = async function(){
    const products = await this.find({}).sort('-created').limit(3).exec();

    if(products){
        return products;
    }
}

ProductSchema.statics.getHottest = async function(){
    const products = await this.find({}).sort('-brought').limit(3).exec();

    if(products){
        return products;
    }
}

ProductSchema.statics.getMostBrought = async function(){
    const products = await this.find({}).sort('-stock').limit(3).exec();

    if(products){
        return products;
    }
}

module.exports = mongoose.model('Product', ProductSchema);