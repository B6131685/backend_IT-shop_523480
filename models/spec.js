const mongoose = require('mongoose');
const { Schema } = mongoose;


const specSchema = new Schema({
    name: {type: String, required:true, trim: true,unique: true}, 
    spec: [],
    
  },{
      collection: 'specs'
  });

const spec = mongoose.model('Spec', specSchema);

module.exports = spec;