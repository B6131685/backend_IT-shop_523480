const mongoose = require('mongoose');
const { Schema } = mongoose;
const product = require('./product')

const cartSchema = new Schema({
    product: [
        { idProduct: {type: Schema.Types.ObjectId, ref:product}, quantity: {type: Number} }
    ],
  },{
      collection: 'carts'
  });

const cart = mongoose.model('carts', cartSchema);

module.exports = cart;