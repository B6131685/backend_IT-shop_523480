const Verification = require('../models/verify');
const User = require('../models/user');

//path for static veridied page
const path = require("path");


exports.verifyUser = async function(req, res ,next){
    try {
        console.log("working verifyUser function");
        const existVerification = await Verification.findOne({userID:req.params.id})

        if(!existVerification){
            const error = new Error('ไม่พบข้อมูลสำหรับ verification อีเมลนี้');
            error.statusCode = 400;
            throw error;
        }

        if(existVerification){
            // const user = await User.findOne({email:existVerification.userID})

            let doc = await User.findByIdAndUpdate({_id:existVerification.userID},{verify: true});
            
            if(!doc){
                const error = new Error('อัพเดรพ verify ไม่สำเร็จ');
                error.statusCode = 400;
                throw error;
            }

            let data = Verification.deleteOne({_id:existVerification._id.toString()});
            if(!data){
                console.log("หลังจากการยืนยันอีเมลของสมาชิกได้ถูกยืนยัน แต่ไม่สามารถลบข้อมูล verification ของสามารถชิกได้ได้ ");
            }

            if(doc){
                res.sendFile(path.join(__dirname,"./../views/verify.html"));
            }
        }

    } catch (error) {
        next(error);
    }
}