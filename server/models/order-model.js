const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    uid: Number,
    stripeCheckoutID: String,
    customer: {
        type: mongoose.Types.ObjectId, 
        ref: 'User'
    },
    items: [{
        product: Object,
        amount: Number
    }
    ],
    price: Number,
    status: String,
    viewed: Boolean,
    address: {
        type: String
    },
    billingAddress: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
});

OrderSchema.statics.nextUID = 1044;
OrderSchema.statics.getNextUID = async function(){

    const lastOrder = await this.findOne({}).sort('-uid').exec();

    if(lastOrder){

        if(lastOrder.uid){
            OrderSchema.statics.nextUID = lastOrder.uid + 1;
        }

        return OrderSchema.statics.nextUID;
    }
    

};

module.exports = mongoose.model('Order', OrderSchema);