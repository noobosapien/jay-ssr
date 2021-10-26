const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name of the shop is required'
    },
    image: {
        type: String
    },
    description: {
        type: String, 
        trim: true
    },
    categories: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Category'
    }]
});

module.exports = mongoose.model('Shop', ShopSchema);