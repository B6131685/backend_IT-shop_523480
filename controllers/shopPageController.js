const ShopPage = require('../models/shopPage');
const productController = require('../controllers/productController')


//for write image
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util');
const e = require('express');
const shopPage = require('../models/shopPage');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

exports.settingPage = async function(req, res ,next){
    try {
        res.status(200).json({ message: "Product already saving"});

    } catch (error) {
        next(error);
    }
}




exports.getshopPage = async (req, res, next) => {
    try {

    // data = await ShopPage.find()
    data = await ShopPage.findOne()
    // console.log(data);
  
    // console.log(data[0].img.length);
    if(data.img.length > 0){
        for (let index = 0; index < data.img.length; index++) {
            data.img[index] = "http://localhost:3000"+'/images/'+data.img[index];
        }
    }
    res.status(200).json({ data: data});
    } catch (error) {
      next(error);  
    }
}

exports.addImgShopPage = async function(req, res ,next){
    try {
        // console.log(req.body.img);
        // console.log(req.body.img); 
        // console.log(req.body); 
        data = await ShopPage.findOne() 
        let newimg = String;
        isBase64 = Boolean;
        let matches = req.body.img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            isBase64 = false
        }else{
            isBase64 = true
        }
        
        console.log(isBase64);

        if(isBase64){
            newimg = await saveImageToDisk(req.body.img);
        }

        console.log(newimg);
        await ShopPage.findOneAndUpdate({
            _id:data._id
        },{
            $push: {
                img : newimg
            }
        })        

        res.status(200).json({ message: "access update shopPage"});

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

exports.destroy = async (req, res, next) => {
    try {
     console.log(req.body);
     //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;
    //โฟลเดอร์ที่ภาพอยู่ใน ตัวโปรเจค path 
    const uploadPath = `${projectPath}/public/images/`;   

    data = await ShopPage.findOne() 
  
    fs.unlink(uploadPath+req.body.name, function (err) {
        if (err) throw new Error('ไม่สามารถลบรูปภาพของ product ที่ต้องการลบได้');
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });

    await ShopPage.updateOne({_id:data._id},{
        $pull: {
            img : req.body.name
        }
    })

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


 exports.editNameShop = async (req, res, next) => {
    try {

    data = await shopPage.findOne();

    console.log(req.body.newName);
    
    data.nameShop = req.body.newName;

    let result = await data.save();

    res.status(201).json({
        data: { message: result}
     })
    
    } catch (error) {
       res.status(400).json({ 
           error: {
               message: "ERROR" + error.message
           }
       }) 
    }
 }