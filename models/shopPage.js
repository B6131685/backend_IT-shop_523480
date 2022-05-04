const mongoose = require('mongoose');
const { Schema } = mongoose;


const shopPagesSchema = new Schema({
    nameShop: { type: String, required:true}, 
    img: [{type: String}], 
  },{
      collection: 'shopPages'
  });

const shopPage = mongoose.model('shopPages', shopPagesSchema);

module.exports = shopPage;