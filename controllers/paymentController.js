const Payment = require('../models/payment')


addPayment = async function(req, res ,next){
    try {
        console.log(req.body);

        const payment = new Payment();
        
        if(!req.body){
            res.status(400).json({ message: "error"});
        }
        
        payment.bankName = req.body.bankName,
        payment.accountBank = req.body.accountBank,
        payment.owner = req.body.owner

        await payment.save();

        res.status(200).json({ message: "add Payment"});
    } catch (error) {
        next(error);
    }
}

editPayment = async function(req, res, next){
    try {
        // console.log(req.body);

        const { bankName, accountBank, owner} = req.body
        const payment = await Payment.findOne();
        console.log(payment);
        
        payment.bankName = bankName;
        payment.accountBank = accountBank;
        payment.owner = owner;
        
        await payment.save();
        res.status(200).json({ message: "update Payment"})
    } catch (error) {
        next(error);
    }
}

getPayment = async function(req, res, next){
    try {
        // console.log(req.body);
        const payment = await Payment.findOne()

        res.status(200).json({ data: payment})
    } catch (error) {
        next(error)
    }
}


module.exports = {
    addPayment,
    editPayment,
    getPayment,
}