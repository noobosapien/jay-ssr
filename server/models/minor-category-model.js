const mongoose = require('mongoose');

const MinorCategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name of the category is required'
    },
    products: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Product'
    }],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }
});

module.exports = mongoose.model('MinorCategory', MinorCategorySchema);