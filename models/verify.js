const mongoose = require('mongoose');
const { Schema } = mongoose;


const verificationSchema = new Schema({
    userID: {type: String, required:true, trim: true,unique: true}, 
    uniqueString: {type: String},
    email: { type:String}
  },{
      collection: 'verificaytions'
  });

const verification = mongoose.model('Verification', verificationSchema);

module.exports = verification;