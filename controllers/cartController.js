const Cart = require('../models/carts');
const User = require('../models/user');
const mongoose = require('mongoose');

updateQuantityProduct = async function(req, res, next){
    try {
        
        let found = true;
        // console.log(req.body);
        let {idUser, idProduct, quantity} = req.body ;
        const user = await User.findOne({_id:idUser});
        // console.log(user);
        const cart = await Cart.findOne({_id:user.cart});
        // console.log(cart);

        for (let index = 0; index < cart.list.length; index++) {
            // console.log(cart.list[index].idProduct);
            // console.log(cart.list[index].idProduct === idProduct);  // false
            // console.log(cart.list[index].idProduct.toString() === idProduct); // true
            if(cart.list[index].idProduct.toString() === idProduct){
                var id = mongoose.Types.ObjectId(idProduct);
                cart.list[index].quantity += quantity
                found = false
            }
            

        }

        if(found){
            cart.list.push({'idProduct':idProduct,'quantity':quantity})
        }

        result = cart.list.filter(element => element.quantity > 0);
        cart.list = result;
        await cart.save();
        res.status(200).json({ msg: 'add to cart success'});
    } catch (error) {
        next(error);
    }

}

getCartByIDUser = async function(req, res, next){
    try {
        let {idUser} = req.body;
        const user = await User.findOne({_id:idUser});
        const cart1 = await Cart.findOne({_id:user.cart});
        await Cart.findOne({_id:user.cart})
                                .populate('list.idProduct')
                                .exec((err,item)=>{
                                    if(err){ 
                                        throw new Error(err)
                                    }

                                    for (let index = 0; index < item.list.length; index++) {
                                        // console.log(item.list[index].idProduct.img);
                                        item.list[index].idProduct.img = "http://localhost:3000"+'/images/'+ item.list[index].idProduct.img;
                    
                                    }


                                    res.status(200).json({ data: item });
                                })
        
        
    } catch (error) {
        next(error)
    }
}

getManyCartByIDCart = async function(req, res, next){
    try {
        await Cart.findOne({_id:req.params.id})
                    .populate('list.idProduct')
                    .exec((err,item)=>{
                        if(err){ 
                            throw new Error(err)
                        }
                        
                        // console.log(item.list.length); 
                        //find and findOne have difference  ... data that return form find() cannot use .length 
                        for (let index = 0; index < item.list.length; index++) {
                            // console.log(item.list[index].idProduct.img);
                            item.list[index].idProduct.img = "http://localhost:3000"+'/images/'+ item.list[index].idProduct.img;
                        
                        }
                        res.status(200).json({ data: item });
                    })

    } catch (error) {
        next(error)
    }
}


updateByReplaceCart  = async function(req, res, next){
    try {
        console.log('update Replace Cart Working');
        // console.log(req.body);
        if(req.body.list.length > 0){
        const user = await User.findOne({_id:req.body.idUser});
        const cart = await Cart.findOne({_id:user.cart})

        const newlist = req.body.list.map( (element,index)=>{
            return {
                idProduct : element.idProduct._id,
                quantity : element.quantity,
                _id: element._id
            }
        })

        result = newlist.filter(element => element.quantity > 0);

        console.log(result);
        cart.list = newlist;
        await cart.save();
        }
        res.status(200).json({ msg: 'Replace cart' });
    } catch (error) {
        next(error)
    }
}


module.exports = {
    updateQuantityProduct,
    getCartByIDUser,
    updateByReplaceCart,
    getManyCartByIDCart
}
