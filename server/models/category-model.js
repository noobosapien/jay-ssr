const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name of the category is required'
    },
    minorCategories: [{
        type: mongoose.Types.ObjectId, 
        ref: 'MinorCategory'
    }],
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop'
    }
});

module.exports = mongoose.model('Category', CategorySchema);