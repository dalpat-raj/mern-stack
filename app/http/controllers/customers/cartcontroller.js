
function cartController() {
  return {
    index(req, res) {
      let slug = req.params.product;
        if (typeof req.session.cart == "undefined") {
          req.session.cart = [];
          req.session.cart.push({
            title: slug,
            qty: 1,
            price: parseFloat(req.body.price).toFixed(2),
            image: req.body.image,
            size: req.body.size,
          });
        } else {
          let cart = req.session.cart;
          let newItem = true;

          for (let i = 0; i < cart.length; i++) {
            if (cart[i].title == slug) {
              if(cart[i].qty < 10){
                cart[i].qty++;
                var itemQty = cart[i].qty
                var itemPrice = cart[i].qty * req.body.price
                newItem = false;
                break;
              }else{
                itemQty = cart[i].qty
                itemPrice = cart[i].qty * req.body.price
                newItem = false;
                break;
              }
            }
          }

          if (newItem) {
            cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(req.body.price).toFixed(2),
                image: req.body.image,
                size: req.body.size,
              });
          }
        }
        // total price
        var totalPrice = 0;
        let cartt = req.session.cart;
        cartt.forEach((data)=>{
          var subb = data.price * data.qty
          totalPrice += +subb
        })
        //return realtime
        return res.json({totalQty: req.session.cart.length, itemQty: itemQty, itemPrice: parseFloat(itemPrice).toFixed(2), totalPrice: totalPrice })
    },
    cartbox(req, res) {
      res.render("customers/cart", {
        title: "cart",
        cart: req.session.cart,
      });
    },
    mainus(req, res){
      let slug = req.params.product;
        const cartt = req.session.cart;

        for (let i = 0; i < cartt.length; i++) {
          if (cartt[i].title == slug) {
            if(cartt[i].qty > 1){
              var item_Qty = cartt[i].qty--;
              var item_Price = cartt[i].qty * req.body.price
            }else{
              item_Qty = cartt[i].qty
              item_Price = cartt[i].qty * req.body.price
            }
          }
        }
      // total price
      var totalpp = 0;
      let carttt = req.session.cart;
      carttt.forEach((dataa)=>{
        var subbb = dataa.price * dataa.qty
        totalpp += +subbb
      })
      //return realtime
      return res.json({totalQty: req.session.cart.length, item_Qty: item_Qty, item_Price: parseFloat(item_Price).toFixed(2), totalpp: totalpp })
    },
    clear(req, res){
        req.session.destroy()
        res.redirect('/cart')
    },
    update(req, res){
      const slug = req.params.product
      const cart = req.session.cart
      const action = req.query.action

      for (let i = 0; i < cart.length; i++) {
          if( cart[i].title == slug ){
              switch (action) {
                  case 'clear':
                      cart.splice(i, 1);
                      if(cart.length == 0) delete req.session.cart;
                      break;
                  
                  default:
                      console.log('update problem');
                      break;
              }
              break;
          }    
      }
      res.redirect('/cart')
  },

  };
}

module.exports = cartController;
