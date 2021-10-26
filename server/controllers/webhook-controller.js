const User = require('../models/user-model');
const Order = require('../models/order-model');
const Product = require('../models/product-model');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

const keys = require('../config/keys');

const stripe = require("stripe")(keys.stripeKey);


const stripeWebHook = async (req, res, next) => {
  try{
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;

    let stripeCheckoutID = "";
    let items = [];
    let price = 0;
    let address = {};
    let billingAddress = {};
  
    try{
      event = stripe.webhooks.constructEvent(payload, sig, keys.localStripeWH);
    }catch(e){
      console.log(e.message);
      return res.status(400).send(`Error: ${e.message}`);
    }

    switch(event.type){
        case 'checkout.session.completed': {
            const session = event.data.object;

            if(session.payment_status === 'paid'){
                const customer = await User.findOne({email: session.customer_details.email});

                const line_items = await stripe.checkout.sessions.listLineItems(session.id);
                
                if(!(line_items.data instanceof Array)){
                  return res.json({
                    message: "No items"
                  });
                }

                if(!(customer.cart instanceof Array)){
                  return res.json({
                    message: "No items in cart"
                  });
                }

                stripeCheckoutID = session.id;

                const doneOrder = await Order.find({stripeCheckoutID});
                
                if(doneOrder.length > 0){
                  return res.status(400).json({
                    message: "Order already placed"
                  });
                }

                for(var i = 0; i < customer.cart.length; i++){
                  const cartItem = await Product.findById(customer.cart[i].product);

                  if(line_items && line_items.data instanceof Array){
                    for(var j = 0; j < line_items.data.length; j++){
                      if(line_items.data[j].description === cartItem.name){
                        try{
                          const prod = await Product.findById(customer.cart[i].product);

                          if(prod){
                            items.push({product: {
                              _id: prod._id,
                              name: prod.name, 
                              stock: prod.stock, 
                              image: prod.image,
                              uid: 'edit this later'
                            }, amount: customer.cart[i].amount});

                            if(!prod.uid)
                              prod.uid = uuidv4();

                            prod.stock -= customer.cart[i].amount;
                            await prod.save();

                          }
              
                        }catch(e){
                          console.log(e);
                        }
                      }
                    }
                  }

                  
                }


                line_items.data.forEach((li) => {
                  price += li.amount_total;
                });
                address = customer.address;
                billingAddress = customer.billingAddress;

                const uid = await Order.getNextUID();

                const order = new Order({
                  uid,
                  stripeCheckoutID,
                  items,
                  price,
                  address,
                  billingAddress,
                  customer,
                  status: 'Processing',
                  viewed: false,
                  created: new Date()
                });

                await order.save();
                await customer.orders.push(order);
                await customer.save();
            }
        }
    }

    res.status(200).send({});
  }catch(e){
    console.log(e);
    res.status(400).json({
      e
    });
  }
}

module.exports = {stripeWebHook};