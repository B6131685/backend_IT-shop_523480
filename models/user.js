const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {type: String, required:true, trim: true}, 
    email: { type: String, required: true, trim: true, unique: true, index: true},
    verify: {type: Boolean, default: false},
    password: { type: String, required: true, trim:true, minlength: 3},
    location: [
      
    ],
    mainlocation: {type : Number, default: 0},
    cart : {type : String},
    role: { type: String, default: 'customer'}
  },{
      collection: 'users'
  });

  // ซ้อนรหัส
  userSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  // ตรวจสอบ password  เปรียบเทียบ
  userSchema.methods.checkPassword = async function(password){
    const isValid = await bcrypt.compare(password, this.password);// this.password น่าจะอิงจาก obj ที่สร้าง
    return isValid;
  }

  const user = mongoose.model('User', userSchema);

  module.exports = user;