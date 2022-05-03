const Spec = require('../models/spec');
const Product = require('../models/product')

exports.addSpecs = async function(req, res ,next){
    try {

        const exist = await Spec.findOne({name:req.body.name})
        if(exist){
            const error = new Error('มีการสร้างโมเดลของสินค้าชนิดนี้ไปแล้ว');
            error.statusCode = 400;
            throw error;
        }



        let spec = new Spec();
        spec.name = req.body.name;
        spec.spec = req.body.spec;
        
        let aftersave = await spec.save();
        console.log(aftersave);
        res.status(200).json({ message: req.body});

    } catch (error) {
        next(error);
    }
}

exports.getSpecs = async function(req, res, next){
    try {
        const result = await Spec.find();

        if(!result){
            const error = new Error('ไม่สามารถดึงข้อมูล Model specs ได้');
            error.statusCode = 400;
            throw error;
        }

        if(result){
            res.status(200).json({
                data: result
            })
        }

    } catch (error) {
        next(error);
    }
}


exports.destroy = async (req, res, next) => {
    try {
     const id  = req.params._id;
     console.log('req.params = '+id);
     const spec = await Spec.deleteOne({ _id: id});
 
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

 exports.destroyMany = async (req, res, next) => {
    try {
     const id  = req.params._id;
     console.log('req.params = '+id);
     const spec = await Spec.deleteOne({ _id: id});

     const product = await Product.deleteMany({typeSpecs: id})
     
    console.log(product.deletedCount);
     if( spec.deletedCount === 0){
         throw new Error('Not found information ro NOT permission')
     }

    //  if( product.deletedCount === 0){
    //     throw new Error('Not found information ro NOT permission')
    // }
 
     res.status(201).json({
         data: { message: "Delete success"}
      })
 
    } catch (error) {
       res.status(400).json({ 
           error: {
               message: "ERROR " + error.message
           }
       }) 
    }
 }

 exports.updateByOne = async (req, res, next) => {

    try {
        // console.log(req.params.id);
        console.log(req.body); 
        const find = await Spec.findOne({_id: req.params._id})

        let difference=[];
        if(find){
            difference = req.body.spec.filter(x => !find.spec.includes(x));
            console.log(difference);
        }

        if(difference.length > 0){
            const product = await Product.find({typeSpecs:req.params._id})

            if(product){
                console.log(product);
            }
        }

        const staff = await Spec.findOneAndUpdate({_id : req.params._id}, req.body);
        console.log(staff);

        res.status(201).json({
            data: staff
         })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Can not update"
        })
    }

 }