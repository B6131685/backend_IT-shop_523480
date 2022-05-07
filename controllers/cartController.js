const Cart = require('../models/carts')
const User = require('../models/user')


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
            // console.log(cart.list[index].idProduct === idProduct);
            console.log(cart.list[index].idProduct.toString() === idProduct);
            if(cart.list[index].idProduct.toString() === idProduct){
                cart.list[index].quantity += quantity
                found = false
            }
        }

        if(found){
            cart.list.push({'idProduct':idProduct,'quantity':quantity})
        }
        await cart.save();
        res.status(200).json({ msg: 'add to cart success'});
    } catch (error) {
        next(error);
    }

}

getCartByID = async function(req, res, next){
    try {
        console.log('path Cart By ID Working');
        let {idUser} = req.body;
        const user = await User.findOne({_id:idUser});
        const cart = await Cart.findOne({_id:user.cart});
        
        res.status(200).json({ data: cart });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    updateQuantityProduct,
    getCartByID
}
