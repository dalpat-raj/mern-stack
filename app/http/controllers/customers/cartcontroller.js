
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
              cart[i].qty++;
              newItem = false;
              break;
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
        return res.json({totalQty: req.session.cart.length })

    },
    cartbox(req, res) {
      res.render("customers/cart", {
        title: "cart",
        cart: req.session.cart,
      });
    },
    update(req, res){
        const slug = req.params.product
        const cart = req.session.cart
        const action = req.query.action

        for (let i = 0; i < cart.length; i++) {
            if( cart[i].title == slug ){
                switch (action) {
                    case 'add':
                        if(cart[i].qty < 9) cart[i].qty++;
                        break;
                    case 'remove':
                        if(cart[i].qty > 1) cart[i].qty--;
                        break;
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
    clear(req, res){
        req.session.destroy()
        res.redirect('/cart')
    }




  };
}

module.exports = cartController;
