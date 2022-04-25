const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
    price: {type: Number, required:true},    
    spec: [],
    img: {type: String, default: 'nopic.png'},
    number: {type: Number, default: 0}
  },{
      collection: 'products'
  });

const product = mongoose.model('Product', productSchema);

module.exports = product;