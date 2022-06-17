const mongoose = require('mongoose');
const { Schema } = mongoose;


const shopPagesSchema = new Schema({
    nameShop: { type: String, required:true}, 
    shipping: { type: Number,default:0},
    cost_shipping: { type: Number, default: 0},
    img: [{type: String}],
    tel: {type:String},
    mail: {type:String},
    address: {type:String},
    logo:{type:String}
  },{
      collection: 'shopPages'
  });

const shopPage = mongoose.model('shopPages', shopPagesSchema);

module.exports = shopPage;