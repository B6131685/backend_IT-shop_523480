const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Verification = require('../models/verify');

const transport = nodemailer.createTransport( {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "gmail",
    auth: {
        user: "wolfsuperdog77@gmail.com",
        pass: "Issarapap7"
    }
});



exports.register = async function(req, res, next){

    try {

        

        // validation    
        const errors = validationResult(req);
        //console.log(errors.array());
        // errors.array() จะได้ข้อมูลที่ไม่ผ่าน validate มา [ {}, {}, {}]

        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg); //ส่งไปทีละอัน
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const existEmail = await User.findOne({email:req.body.email})
        if(existEmail){
            
            const error = new Error('อีเมล์ซ้ำ มีผู้ใช้งานแล้ว ลองใหม้อีกครั้ง');
            error.statusCode = 400;
            throw error;
        }

        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        
        user.password = await user.encryptPassword(req.body.password);
        user.location = req.body?.address;
        user.cart = req.body?.cart;

        let aftersave = await user.save()
        .then()
        .catch((err)=>{
            const error = new Error('ไม่สามารถทำการบันทึกข้อมูล user ลงฐานข้อมูล');
            error.statusCode = 400;
            throw error;
        })

        console.log('aftersave');
        console.log(aftersave._id.toString());

        let uniqueString  = await user.encryptPassword(aftersave._id.toString());

        let verify = new Verification();
        verify.userID = aftersave._id.toString();
        verify.uniqueString = uniqueString;
        
        let aftersaveverify = await verify.save()
        
        if(aftersaveverify){
            console.log('save verification success');
        }else{
            console.log('saving verification has problem')
        }

        let options = {
            from: "wolfsuperdog77@gmail.com",
            to: "",
            subject: "verify IT Shop",
            html: `<p>Verify your email address to complete the singup and login your account.</p>
                    <p>this link </p> <p><a href=${"http://localhost:3000/verify/"+aftersave._id.toString()}>Press</a></p>`
        }

        options.to = req.body.email;

        transport.sendMail(options, (err, info)=>{
            if(err){
                console.log(err);
                const error = new Error('การส่งเมลเกิดข้อผิดพลาด');
                error.statusCode = 400;
                throw error;
            }
        })

        res.status(200).json({ message: req.body});

    } catch (error) {
        next(error);
    }    
}



exports.login = async function(req, res, next){
    try {
        // console.log(req.body);
        const {email, password} = req.body;
        
        const user = await User.findOne({ email:email });
        // console.log("after findOne");
        // console.log(user);
        // console.log(user);
        if(!user){
            const error = new Error('ไม่พบผู้ใช้งาน');
            error.statusCode = 404;
            throw error;
        }
        
        //ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่ ถ้าไม่ตรงจะเป็น (false) 
        const isvalid = await user.checkPassword(password); //
        if(!isvalid){
            const error = new Error('รหัสผ่านไม่ถูกต้อง');
            error.stsatusCode = 401;
            throw error;
        }

        if(user.verify === false){
            const error = new Error('คุณยังไม่ได้ยืนยันอีเมล');
            error.stsatusCode = 401;
            throw error;
        }

        // create token
        const token = await jwt.sign({
            id: user._id,
            role: user.role,
            name: user.name,
        },"FBF852F950F0A6A3210771C9622D74CD686D472C11A975DB7FEAE7EC662815DC",{ expiresIn: '5 days'});

        //decode
        const exprires_in = jwt.decode(token)

        res.status(200).json({ 
            access_token: token,
            exprires_in: exprires_in.exp,
            token_type: 'Bearer' //besrer บอกให้ frontend ส่งแนบมากับ header
        });


    } catch (error) {
        next(error);
    }
}


exports.me = async function(req, res, next) {
    try {

        // console.log(req);
        // console.log(req.body.role);
        console.log(req.body);
        res.status(200).json({ data: "get me success"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ data: "ERROR"});
    }
    
}


