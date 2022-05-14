const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/carts')
addOrder = async function(req, res ,next){
    try {
        console.log(req.body);
        let order = new Order();
        
        let cart = new Cart();
        newcart = await cart.save();
        if(!newcart){
            const error = new Error('เกิดปัญหาไม่สามารถสร้างจะกร้าใหม้ได้');
            error.statusCode = 400;
            throw error;
        }
        // console.log(newcart._id);
        let user = await User.findOneAndUpdate({_id:req.body.idUser},{cart:newcart._id})
        console.log(user);
        if(!newcart){
            const error = new Error('เกิดปัญหาไม่สามารถเพิ่มตะกร้าใหม้ให้ลูกค้าได้');
            error.statusCode = 400;
            throw error;
        }

        order.idCart = req.body.idCart;
        order.idUser = req.body.idUser;

        aftersave = await order.save();
        // console.log(aftersave);
        res.status(200).json({ message: "Order already saving"});
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addOrder
}