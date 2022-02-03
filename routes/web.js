const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartcontroller')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

// middleware's
const guest = require('../app/http/middleware/guest')
const auth= require('../app/http/middleware/auth')
const admin= require('../app/http/middleware/admin')
const { application } = require('express')


function initRoutes(app){
    
    app.get('/', homeController().index)
    
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)


    app.post('/cart/add/:product', cartController().index)
    app.get('/cart', cartController().cartbox)
    app.get('/cart/update/:product', cartController().update)
    app.get('/cart/clear', cartController().clear)


    
    // customers routes 
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().showw)



    // admin routes 
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)




}

module.exports = initRoutes