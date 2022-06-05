const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    bankName: { type: String}, 
    accountBank: { type: Number},
    owner: { type: String}, 
  },{
      collection: 'payments'
  });

const payment = mongoose.model('payments', paymentSchema);

module.exports = payment;