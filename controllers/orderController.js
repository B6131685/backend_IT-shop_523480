const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/carts');
const Product = require('../models/product');

//for write image
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util');
const e = require('express');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

addOrder = async function(req, res ,next){
    try {
        console.log(req.body);
        let order = new Order();
        
         
        order.idCart = req.body.idCart;
        order.idUser = req.body.idUser;

        
        checkCart = await Cart.findOne({_id:req.body.idCart}) 
        console.log(checkCart);

        //check
        for (let index = 0; index < checkCart.list.length; index++) {
            let product = await Product.findOne({_id:checkCart.list[index].idProduct})
            // console.log(product);
            if(checkCart.list[index].quantity > product.number){
                console.log(product.spec[0].value+' : quantity-Cart geather than stock-Product');
                const error = new Error('จำนวนสินค้าไม่สัมพันธ์กับปัจจุบัน');
                error.statusCode = 400;
                throw error;
            }
        }
        
        //cut order
        for (let index = 0; index < checkCart.list.length; index++) {
            let product = await Product.findOne({_id:checkCart.list[index].idProduct})
            // console.log(product);
            product.number = product.number - checkCart.list[index].quantity;
            after =  await product.save();
            // console.log(after);
        }

        let cart = new Cart();
        
        newcart = await cart.save();
        if(!newcart){
            const error = new Error('เกิดปัญหาไม่สามารถสร้างจะกร้าใหม้ได้');
            error.statusCode = 400;
            throw error;
        }
        await User.findOneAndUpdate({_id:req.body.idUser},{cart:newcart._id})
        if(!newcart){
            const error = new Error('เกิดปัญหาไม่สามารถเพิ่มตะกร้าใหม้ให้ลูกค้าได้');
            error.statusCode = 400;
            throw error;
        }


        aftersave = await order.save();
        res.status(200).json({ message: "Order already saving"});
    } catch (error) {
        next(error)
    }
}

getOrderNotSlip = async function(req, res ,next){
    try {
        console.log(req.body);
        order = await Order.find({idUser:req.body.idUser,slipStatus: false})

        res.status(200).json({ data: order});
    } catch (error) {
        next(error)
    }
}

getOrderHaveSlip = async function(req, res ,next){
    try {
        console.log(req.body);
        order = await Order.find({idUser:req.body.idUser,slipStatus: true})

        const ordertWithPhotoDomain = order.map( (element, index)=> {
            // console.log(element);
            return {
                _id: element._id,
                address: element.address,
                idTrackingprice: element.idTracking,
                paymentStatus: element.paymentStatus,
                slipVerification: "http://localhost:3000"+'/images/'+element.slipVerification,
                slipStatus : element.slipStatus,
                idCart: element.idCart,
                idUser: element.idUser,

            }
        })

        res.status(200).json({ data: ordertWithPhotoDomain});
    } catch (error) {
        next(error)
    }
}

getAllOrderHaveSlip = async function(req, res ,next){
    try {
        // console.log(req.body);
        order = await Order.find({slipStatus: true})

        const ordertWithPhotoDomain = order.map( (element, index)=> {
            // console.log(element);
            return {
                _id: element._id,
                address: element.address,
                idTrackingprice: element.idTracking,
                paymentStatus: element.paymentStatus,
                slipVerification: "http://localhost:3000"+'/images/'+element.slipVerification,
                slipStatus : element.slipStatus,
                idCart: element.idCart,
                idUser: element.idUser,

            }
        })

        res.status(200).json({ data: ordertWithPhotoDomain});
    } catch (error) {
        next(error)
    }
}

updateSlip = async function(req, res ,next){
    try {
        // console.log(req.body.idOrder);
        // order = await Order.find({idUser:req.body.idUser,slipStatus: false})
        // {idOrder:String,img:String}
        let img
        
        if(!req.body.idOrder){
            const error = new Error('ไม่ได้รับข้อมูล id Order');
            error.statusCode = 400;
            throw error;
        }

        if(req.body.img){
            img = await saveImageToDisk(req.body.img)
        }else{
            const error = new Error('ไม่ได้แนปรูปภาพ');
            error.statusCode = 400;
            throw error;
        }

        order = await Order.findOneAndUpdate({_id:req.body.idOrder},{slipVerification:img,slipStatus:true,address:req.body.address})

        console.log(order);
        
        res.status(200).json({ mag : 'update slip success'});
    } catch (error) {
        next(error)
    }
}

async function saveImageToDisk(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;
    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    //เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath+filename, image.data, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = matches[2];

    return image;
}


module.exports = {
    addOrder,
    getOrderNotSlip,
    getOrderHaveSlip,
    updateSlip,
    getAllOrderHaveSlip
}