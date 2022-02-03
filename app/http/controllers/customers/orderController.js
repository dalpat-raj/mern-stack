const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


function orderController(){
    return{
        store(req, res){

            var { paymentType, stripeToken } = req.body;
            var totalPrice = 0; 
            let cart = req.session.cart
            for(let data of cart){
                totalPrice += +data.price * data.qty
            }
            const order = new Order({
                customerId: req.user._id,
                name: req.user.firstName,
                phone: req.user.phone,
                area: req.user.area,
                city: req.user.city,
                pin: req.user.pin,
                items: req.session.cart
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' },async (err, placedOrder)=>{
                    // stripe payment 
                    if(paymentType === 'card'){
                        stripe.charges.create({
                            amount: totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr'
                          }).then((ress)=>{
                              placedOrder.paymentStatus = true;
                              placedOrder.paymentType = paymentType
                              placedOrder.save().then((ord)=>{
                                //emit  
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ massage: 'payment successful order placed'})
                            }).catch((err)=>{
                                console.log(err);
                            })

                        }).catch((err)=>{
                            delete req.session.cart
                            return res.json({ massage: 'payment failed, you pay deleviry time '}) 
                        })
                    }else{
                        delete req.session.cart
                        return res.json({ massage: 'order save cod '})
                    }
                })
            }).catch(err => {
                return res.status(500).json({ massage: 'something went wrong '}) 
               
            })
        },
        async index(req, res){
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate,max-stale=0, post-check=0, pre-check=0')    
            res.render('customers/orders', {orders: orders, moment: moment })
        },
        async showw(req, res){
            const order = await Order.findById(req.params.id)
            // authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/sorder', { order: order })
            }
            return res.redirect('/')
        }, 
    }
}

module.exports = orderController