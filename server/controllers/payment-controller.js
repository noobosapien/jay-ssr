const User = require('../models/user-model');
const Order = require('../models/order-model');
const Product = require('../models/product-model');
const paymentHelper = require('../helpers/paymentHelper');
const keys = require('../config/keys');
const rural = require('../data/postcodes');

const stripe = require("stripe")(keys.stripeKey);

const createPaymentIntent = async (req, res, next) => {
  try{
    const { items, shippingPrice } = req.body;
    const user = await User.findById(req.auth._id);

    if(user){

      if(!(items instanceof Array)){
        return res.json({
          error: 'items is not an array'
        });
      }

      var lineItems = [];
      
      for(var i = 0; i < items.length; i++){
        const product = await Product.findById(items[i]._id);

        if(!product){
          return res.json({
            error: "Product not found"
          });
        }

        var object = {};
        object.price_data = {};
        object.price_data.currency = 'nzd';
        object.price_data.product_data = {name: product.name};

        object.price_data.unit_amount = product.price1 && product.price2 && product.price3 ? 
        items[i].amount > 0 && items[i].amount < product.price1.lessThan ?
        product.price1.price:
        items[i].amount >= product.price1.lessThan && items[i].amount < product.price2.moreThan ?
        product.price2.price:
        items[i].amount >= product.price2.moreThan ?
        product.price3.price:
        undefined : undefined

        if(!object.price_data.unit_amount){
          return res.json({
            error: "Price is invalid"
          });
        }

        object.quantity = items[i].amount;
        lineItems.push(object);
      }

      const shipping = {
        price_data: {
          currency: "nzd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Number(shippingPrice),
        },
        quantity: 1,
      }

      lineItems.push(shipping);
      // console.log(lineitems[0].price_data.product_data)


      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [...lineItems],
        mode: "payment",
        // success_url: "https://www.jaytronics.co.nz/ordersuccess/{CHECKOUT_SESSION_ID}",
        // cancel_url: "https://www.jaytronics.co.nz/cart",
        success_url: "https://localhost:3000/ordersuccess/{CHECKOUT_SESSION_ID}",
        cancel_url: "https://localhost:3000/cart",
        customer_email: user.email,
      });
    
      res.send({
        url: session.url
      });
    }else{
      res.send({
        error: "User not found"
      });
    }
    
  }catch(e){
    console.log(e);
    res.json({
      error: e
    })
  }
    
}

const getCartFromUser = async (req, res, next)=>{

  try{
    const user = await User.findById(req.auth._id);
    var cart = [];

    if(user && user.cart){
      for(var i = 0; i < user.cart.length; i++){
        var prod = await Product.findById(user.cart[i].product);
        if(prod && prod._doc){
          prod._doc.amount = user.cart[i].amount;
          cart.push(prod);
        }
      }
    }
    
    res.json(cart);
  }catch(e){
    console.log(e);
  }
  
}

const putCartToUser = async (req, res, next) => {
  try{
    
    if(req.body instanceof Array){
      const user = await User.findById(req.auth._id);
      
      await User.updateOne({_id:req.auth._id}, { $set: { cart: [] }});

      await user.save();

      for(var i = 0; i < req.body.length; i++){
        const product = {product: req.body[i]._id, amount: req.body[i].amount}
        await user.cart.push(product);
      }

      await user.save();
    }
  
    res.json({message: "Success"});
  }catch(e){
    console.log(e);
  }
}

const viewOrder = async (req, res, next) => {
  try{
    const stripeCheckoutID = req.query.id;
    const order = await Order.findOne({stripeCheckoutID, customer: req.auth._id});
  
    if(!order){
      return res.json({viewed: true});
    }

    if(order && order.viewed){
      // return res.json({viewed: true});
    }

    if(order){
      order.viewed = true;
      await order.save();
    }

    return res.json({viewed: false});
  }catch(e){
    console.log(e);
  }
}

const getShipping = async (req, res, next) => {
  var price = 600;
  if(rural.includes(Number(req.query.pc))){
    price = 1100;
  }else{
    price = 600;
  }

  const user = await User.findById(req.auth._id);
  user.shipping = price;
  await user.save();

  return res.json({
    price
  });
}

const getShippingPrice = async (req, res, next) => {
  const user = await User.findById(req.auth._id);
  if(user.shipping){
    return res.json({
      shipping: user.shipping
    });
  }
  return res.json({
    shipping: 600
  });
}

module.exports = {createPaymentIntent, getCartFromUser, putCartToUser, viewOrder, getShipping, getShippingPrice}