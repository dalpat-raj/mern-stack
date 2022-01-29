

function cartController() {

    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res){
            // for the first time creating cart and adding basic object structure
            if(!req.session.cart){
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
              // check if item does not exist in cart 
              if(!cart.items[req.body._id]){
                  cart.items[req.body._id] = {
                      item: req.body,
                      qty: 1
                    }
                    cart.totalQty = cart.totalQty + 1;
                    cart.totalPrice = cart.totalPrice + req.body.price     
                }else if(cart.items[req.body._id].qty < 10){
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                    cart.totalQty = cart.totalQty + 1
                    cart.totalPrice = cart.totalPrice + req.body.price
                }
           
                return res.json({totalQty: req.session.cart.totalQty, Qty: req.session.cart.items[req.body._id].qty, totalPrice: req.session.cart.totalPrice, price: req.body.price })
       
        },
        minusupdate(req, res){
            let cart = req.session.cart  
                if(cart.items[req.body._id].qty > 1){
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1
                    cart.totalQty = cart.totalQty - 1
                    cart.totalPrice = cart.totalPrice - req.body.price
           
                return res.json({totalQty: req.session.cart.totalQty, Qty: req.session.cart.items[req.body._id].qty, totalPrice: req.session.cart.totalPrice, price: req.body.price })
                }else{
                    console.log('minimum 1 quantity');
                }
        },
     
      
    }
}


module.exports = cartController


