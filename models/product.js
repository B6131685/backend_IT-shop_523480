const mongoose = require('mongoose');
const { Schema } = mongoose;
const specs = require('../models/spec')

const productSchema = new Schema({
    price: {type: Number,default: 0, required:true},
    typeSpecs:{ type: Schema.Types.ObjectId, ref:specs, required:true},    
    spec: [],
    img: {type: String, default: 'nopic.png'},
    number: {type: Number, default: 0},
    date: {type:Date, default: Date.now },
    activeStatus: {type:Boolean, default: true}
  },{
      collection: 'products'
  });

const product = mongoose.model('Product', productSchema);

module.exports = product;