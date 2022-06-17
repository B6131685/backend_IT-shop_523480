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
// const order = require('../models/order');
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

//user get order have slip that wait to verify
getOrderHaveSlip = async function(req, res ,next){
    try {
        
        order = await Order.find({idUser:req.body.idUser,slipStatus: true, verify:false,activeStatus:true})

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

//user get order have slip that disapprove
getOrderDisapprove = async function(req, res ,next){
    try {
        console.log(req.params.id);
        const order = await Order.find({idUser:req.params.id,slipStatus: true, verify:true, paymentStatus: false})
        .populate({
            path:'idCart',
            populate: {
                path: 'list.idProduct',
                model: 'Product'
            }
        }).exec((err, type)=>{
            if(err){
                res.status(400).json({
                    data: err
                })
            }


            const ordertWithPhotoDomain = type.map( (element, index)=> {
                // console.log(element);
                    return {
                        _id: element._id,
                        address: element.address,
                        idTracking: element.idTracking,
                        paymentStatus: element.paymentStatus,
                        slipVerification: "http://localhost:3000"+'/images/'+element.slipVerification,
                        slipStatus : element.slipStatus,
                        idCart: element.idCart,
                        idUser: element.idUser,
                        updateAt: element.updateAt,
                        createAt: element.createAt
                        
                    }
            })
    
            res.status(200).json({ data: ordertWithPhotoDomain});
        })
        
    } catch (error) {
        next(error)
    }
}

//มีสลิป แต่ admin ยังไม่ตรวจสอบ--- สำหรับadmin ดึงทั้งหมดไปตรวจสอบ
getAllOrderHaveSlip = async function(req, res ,next){
    try {
        // console.log(req.body);
        const order = await Order.find({slipStatus: true, activeStatus: true, verify:false })
        console.log(typeof order);
        console.log(order.length);

        let ordertWithPhotoDomain = [];
        for (let index = 0; index < order.length; index++) {

            ordertWithPhotoDomain.push({
                _id: order[index]._id,
                address: order[index].address,
                idTrackingprice: order[index].idTracking,
                paymentStatus: order[index].paymentStatus,
                slipVerification: "http://localhost:3000"+'/images/'+order[index].slipVerification,
                slipStatus : order[index].slipStatus,
                idCart: order[index].idCart,
                idUser: order[index].idUser,
            });
        }

       res.status(200).json({ data: ordertWithPhotoDomain});
    
    } catch (error) {
        next(error)
    }
}
 
//ดึง order ที่ตรวจแล้วไปใส่ค่า ID tracking และ บริษัทขนส่ง
getAllOrderHaveSlipAndVerifyTrue = async function(req, res ,next){
    try {
        // console.log(req.body);
        const order = await Order.find({slipStatus: true, activeStatus: true, verify:true, paymentStatus: true , idTracking: "not fill"})
        .populate('idUser')
        .populate({
            path:'idCart',
            populate: {
                path: 'list.idProduct',
                model: 'Product'
            }
        })
        .exec((err, type)=>{
            if(err){
                res.status(400).json({
                    data: err
                })
            }


        
            const ordertWithPhotoDomain = type.map( (element, index)=> {
                // console.log(element);
                return {
                    _id: element._id,
                    address: element.address,
                    idTracking: element.idTracking,
                    paymentStatus: element.paymentStatus,
                    slipVerification: "http://localhost:3000"+'/images/'+element.slipVerification,
                    slipStatus : element.slipStatus,
                    idCart: element.idCart,
                    idUser: element.idUser,
    
                }
            })

            res.status(200).json({
                data: ordertWithPhotoDomain
            })
            
            // res.status(200).json({
            
            //         _id: type._id,
            //         address: type.address,
            //         idTracking: type.idTracking,
            //         paymentStatus: type.paymentStatus,
            //         slipVerification: "http://localhost:3000"+'/images/'+type.slipVerification,
            //         slipStatus : type.slipStatus,
            //         idCart: type.idCart,
            //         idUser: type.idUser
            // })
        
        })
        // console.log(order);
        // res.status(200).json({ msg: 'test API'});
    } catch (error) {
        next(error)
    }
}

// 
getAllOrderHaveAlreadySend = async function(req, res ,next){
    try {
        // console.log(req.body);
        order = await Order.find({slipStatus: true, activeStatus: true, verify:true, paymentStatus: true,idTracking: { $ne: "not fill" } }) //ne = not equal
        .populate({
            path:'idCart',
            populate: {
                path: 'list.idProduct',
                model: 'Product'
            }
        }).
        populate('idUser')
        .exec((err, type)=>{
            if(err){
                res.status(400).json({
                    data: err
                })
            }

            const ordertWithPhotoDomain = type.map((element, index)=> {
                // console.log(element);
                    return {
                        _id: element._id,
                        address: element.address,
                        idTracking: element.idTracking,
                        paymentStatus: element.paymentStatus,
                        slipVerification: "http://localhost:3000"+'/images/'+element.slipVerification,
                        slipStatus : element.slipStatus,
                        idCart: element.idCart,
                        idUser: element.idUser,
                        updateAt: element.updateAt,
                        createAt: element.createAt,
                        expressCompany: element.expressCompany
                        
                    }
            })

            res.status(200).json({
                data: ordertWithPhotoDomain
            })

        //     res.status(200).json({
            
        //                 id: type._id,
        //                 address: type.address,
        //                 idTracking: type.idTracking,
        //                 paymentStatus: type.paymentStatus,
        //                 slipVerification: "http://localhost:3000"+'/images/'+type.slipVerification,
        //                 slipStatus : type.slipStatus,
        //                 idCart: type.idCart,
        //                 idUser: type.idUser,
        //                 updateAt: type.updateAt,
        //                 createAt: type.createAt,
        //                 expressCompany: type.expressCompany
        // })
    
            
        })


        
    } catch (error) {
        next(error)
    }
}

updateIDTracking = async function(req, res ,next){
    try {
        console.log(req.body);
        

        const order = await Order.findOne({_id: req.body.idOrder});
        if(!order){
            const error = new Error('ไม่พบรายการสั่งซื้อนี้');
            error.statusCode = 400;
            throw error;
        }
                     
        if(!req.body.idTracking){
            const error = new Error('ไม่ได้รับ idTracking');
            error.statusCode = 400;
            throw error;
        }

        if(!req.body.expressCompany){
            const error = new Error('ไม่ได้รับชื่อบริษัทขนส่ง');
            error.statusCode = 400;
            throw error;
        }

        order.idTracking = req.body.idTracking;
        order.expressCompany = req.body.expressCompany;
        order.updateAt = Date.now()
        await order.save();

        res.status(200).json({ data: 'update id tracking success'});
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

        
        res.status(200).json({ msg : 'cancle order success'});
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
    getAllOrderHaveSlipAndVerifyTrue,
    getOrderDisapprove,
    updateIDTracking,
    getAllOrderHaveAlreadySend
}