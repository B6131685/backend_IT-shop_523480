const Product = require('../models/product');
const specs = require('../models/spec')
//for write image
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util');
const e = require('express');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

exports.addProduct = async function(req, res ,next){
    try {

        // console.log(req.body);
        let element;
        // console.log(req.body.spec);
        for (let index = 0; index < req.body.spec.length; index++) {
            if (req.body.spec[index].name === "Model") {
                element = req.body.spec[index];
            }
        }
        console.log(element.value);
        let name = element.value;
        const exist = await Product.find({"spec.name": "Model", "spec.value": element.value})
        if(!exist){
            const error = new Error('เพิ่มสินค้าซ้ำ');
            error.statusCode = 400;
            throw error;
        }



        let product = new Product();
        product.typeSpecs = req.body.typespec;
        product.price = req.body.price;
        product.spec = req.body.spec;
        if(req.body.img){
            product.img = await saveImageToDisk(req.body.img)
        }
        
        let aftersave = await product.save();
        // console.log(aftersave);
        res.status(200).json({ message: "Product already saving"});

    } catch (error) {
        next(error);
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


exports.getAllProduct = async (req, res, next) => {
    try {
        //const menu = await Menu.find();
    await Product
    .find()
    .populate('typeSpecs')
    .exec((err, type)=>{
        if(err){ 
            throw new Error(err)
        }
        // console.log(type);
        const productWithPhotoDomain = type.map( (element, index)=> {
            // console.log(element);
            return {
                id: element._id,
                type: element.typeSpecs,
                price: element.price,
                spec: element.spec,
                img: "http://localhost:3000"+'/images/'+element.img,
                number : element.number,
                date: element.date
            }
        })
    
        res.status(200).json({
            data: productWithPhotoDomain
        })
    });
    // console.log(product);
    } catch (error) {
      next(error);  
    }
}

exports.getProductByID = async (req, res, next) => {
    try {
        //const menu = await Menu.find();
    const id  = req.params._id;
    // console.log('req.params = '+id);
    // console.log(req.param._id.value);    
    await Product
    .findOne({_id:id})
    .populate('typeSpecs')
    .exec((err, type)=>{
        if(err){ 
            res.status(400).json({
                data: "error"
            })
        }
        // console.log(type);
        res.status(200).json({
            
                id: type._id,
                type: type.typeSpecs,
                price: type.price,
                spec: type.spec,
                img: "http://localhost:3000"+'/images/'+type.img,
                number : type.number,
                date: type.date
        })
    });
    // console.log(product);
    } catch (error) {
      next(error);  
    }
}


exports.updateProductStock = async (req, res ,next) => {
    try {
    // console.log(req.body);
    const {id, mode, number } = req.body; // ทำ object destructuring

    const product = await Product.findOne({ _id: req.body.id })

    if(!product){
        const error = new Error('หาสินค้าที่จะแก้ไขไม่พบ');
        error.statusCode = 400;
        throw error;
    }

    // console.log(product);

    

    if(product){
    
    if(req.body.mode === "Addition"){
        product.number = product.number + req.body.number;
    }

    if(req.body.mode === "Subtraction"){
        if(product.number >= req.body.number){
            product.number = product.number - req.body.number;
        }else{
            const error = new Error('จำนวนสินค้าที่ต้องการลบมีมากกว่าจำนวนสินค้าที่มี');
            error.statusCode = 400;
            throw error;
        }
    }
    
    let result = await product.save();
    // Product.findByIdAndUpdate({_id:id}, {number:req.body.quantity}, {new: true}, function(err, doc) {
    //     if (err) return res.send(500, {error: err});
    //     return res.send('Succesfully saved.');
    // });

    }

    res.status(200).json({
        msg: "success updateProductStock"
    })
    } catch (error) {
        next(error)
    }
}


exports.updateByOne = async (req, res, next) => {

    try {
        
        // let product = new Product();
        // product = req.body
        const product = await Product.findOne({ _id: req.body.id })

        if(!product){
            const error = new Error('หาสินค้าที่จะแก้ไขไม่พบ');
            error.statusCode = 400;
            throw error;
        }
        


        if(product){
            console.log('เจอที่อยากอัพเดรต');
            product.price = req.body.price;
            product.number = req.body.number;
            product.spec = req.body.spec;
            
            isBase64=Boolean;
            var matches = req.body.img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                isBase64 = false
            }else{
                isBase64 = true
            }
            
            if(isBase64){
                product.img = await saveImageToDisk(req.body.img)
            }
        }
        
        let result = await product.save();
        
        // const staff = await Product.findOneAndUpdate({_id : req.params._id}, req.body);

        res.status(201).json({
            data: result
         })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Can not update"
        })
    }
 }

 exports.destroy = async (req, res, next) => {
    try {

     //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;
    //โฟลเดอร์ที่ภาพอยู่ใน ตัวโปรเจค path 
    const uploadPath = `${projectPath}/public/images/`;   

     const id  = req.params._id;
     const obj = await Product.findOne({_id:id})
    if (obj.img != 'nopic.png') {
        
        fs.unlink(uploadPath+obj.img, function (err) {
            if (err) throw new Error('ไม่สามารถลบรูปภาพของ product ที่ต้องการลบได้');
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    }    
    //  console.log('req.params = '+id);
     const spec = await Product.deleteOne({ _id: id});
     
     
     if( spec.deletedCount === 0){
         throw new Error('Not found information ro NOT permission')
     }
 
     res.status(201).json({
         data: { message: "Delete success"}
      })
 
    } catch (error) {
       res.status(400).json({ 
           error: {
               message: "ERROR" + error.message
           }
       }) 
    }
 }