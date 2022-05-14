const mongoose = require('mongoose');
const { Schema } = mongoose;
const cart = require('./carts')
const user = require('./user')

const orderSchema = new Schema({
    
    idCart: {type: Schema.Types.ObjectId, ref:cart}, // where cart
    idUser: {type: Schema.Types.ObjectId, ref:user}, // who user
    address: { type: String, default:"not fill"}, // where 
    idTracking: { type: String, default: "not fill"}, // number express to follow product
    paymentStatus: { type: Boolean, default: false}, // admin verify slip
    slipVerification: {type: String, default: 'nopic.png'}, // slip img
    slipStatus: {type: Boolean, default: false} // check user is attach slip yet
  },{
      collection: 'orders'
  });

const order = mongoose.model('orders', orderSchema);

module.exports = order;