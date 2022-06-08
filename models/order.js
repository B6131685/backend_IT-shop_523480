const mongoose = require('mongoose');
const { Schema } = mongoose;
const cart = require('./carts')
const user = require('./user')

const orderSchema = new Schema({
    
    idCart: {type: Schema.Types.ObjectId, ref:cart}, // where cart
    idUser: {type: Schema.Types.ObjectId, ref:user}, // who user
    address: { type: String, default:"not fill"}, // where 
    idTracking: { type: String, default: "not fill"}, // number express to follow product
    expressCompany:{type: String},
    paymentStatus: { type: Boolean, default: false}, // admin verify slip
    verify: { type: Boolean, default: false},
    slipVerification: {type: String, default: 'nopic.png'}, // slip img
    slipStatus: {type: Boolean, default: false}, // check user is attach slip yet
    activeStatus: {type: Boolean, default: true}, //
    shipping: {type: Number}, //shipping นะช่วงเวลานั้นๆที่ซื้อ  ถ้าไปดึงมาจาก ในอนาคตค่าอาจเปลี่ยน
    createAt: {type:Date, default: Date.now }, //
    updateAt: {type:Date, default: Date.now } //
  },{
      collection: 'orders'
  });

const order = mongoose.model('orders', orderSchema);

module.exports = order;