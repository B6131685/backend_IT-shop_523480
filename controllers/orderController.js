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
const { verify } = require('crypto');
// const user = require('../models/user');
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
        order = await Order.find({idUser:req.body.idUser,slipStatus: false, activeStatus:true}) 


        // console.log(order);
        res.status(200).json({ data: order});
    } catch (error) {
        next(error)
    }
}

getOrderHaveSlip = async function(req, res ,next){
    try {
        
        order = await Order.find({idUser:req.body.idUser,slipStatus: true})

        const ordertWithPhotoDomain = order.map( (element, index)=> {
            
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
        order = await Order.find({slipStatus: true, activeStatus: true, verify:false })

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

getAllOrderHaveSlipAndVerifyTrue = async function(req, res ,next){
    try {
        // console.log(req.body);
        order = await Order.find({slipStatus: true, activeStatus: true, verify:true, paymentStatus: true })

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

        order = await Order.findOneAndUpdate({_id:req.body.idOrder},{slipVerification:img,slipStatus:true,address:req.body.address, updateAt:Date.now()});

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


cancleOrder = async function(req, res ,next){
    try {

         order = await Order.findOneAndUpdate({_id:req.params.id}, {activeStatus:false, updateAt: Date.now() }); //อย่าลืมแก้กลับเป็น false

        //นำสินค้าที่ยกเลิกบวกจำนวนที่จองกลับไปขายใหม้
        // console.log(order);
        cart = await Cart.findOne({_id:order.idCart})
        // console.log(cart);

        for (let index = 0; index < cart.list.length; index++) {
             product = await Product.findOne({_id:cart.list[index].idProduct})
             product.number += cart.list[index].quantity;
             await product.save();
        }

        
        res.status(200).json({ mag : 'cancle order success'});
    } catch (error) {
        next(error)
    }
}


getOrderNotActive = async function(req, res ,next){
    try {
        console.log(req.params.id);
        user = await User.findOne({_id:req.params.id})
        // console.log(user);

        if(user.role === 'customer'){
            order = await Order.find({idUser:req.params.id,activeStatus:false})
            .populate({
                path: 'idCart',
                populate: {
                    path: 'list.idProduct',
                    model: 'Product'
                }
            })
            .exec((err, type)=>{
                if(err){ 
                    res.status(400).json({
                        data: "error"
                    })
                }
                // console.log(type);
                res.status(200).json({
                    
                    data:type
                })
            });



            // res.status(200).json({ data : order});
        }else{
            res.status(200).json({ data : []});
        }


    } catch (error) {
        next(error)
    }
}

verifyPayment = async function(req, res ,next){
    try {

        console.log(req.body);
        user = await User.findOne({_id:req.body.idUser})
        if(user.role !== 'admin'){
            const error = new Error('ไม่มีสิทธิ์เข้าถึง');
            error.statusCode = 400;
            throw error;
        }

        order = await Order.findOne({_id: req.body.idOrder})
        if(!order){
            const error = new Error('ไม่พบรายการสั่งซื้อในการอัพเดรต');
            error.statusCode = 400;
            throw error;
        }

        if( req.body.paymentStatus === true){
            await Order.findOneAndUpdate({_id: req.body.idOrder},{verify:true ,paymentStatus: true});
            res.status(200).json({ msg: 'verify ---> paymentStatus: true'});

        }else if(req.body.paymentStatus === false){
            await Order.findOneAndUpdate({_id: req.body.idOrder},{verify:true});
            res.status(200).json({ msg: 'verify ---> paymentStatus: false!'});
        }else{
            const error = new Error('req ไม่ถูกต้อง');
            error.statusCode = 400;
            throw error;
        }

    } catch (error) {
        next(error)
    }
}

module.exports = {
    addOrder,
    getOrderNotSlip,
    getOrderHaveSlip,
    updateSlip,
    getAllOrderHaveSlip,
    cancleOrder,
    getOrderNotActive,
    verifyPayment,
    getAllOrderHaveSlipAndVerifyTrue
}