const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
    name: { type: String, required: true},
    phone: { type: Number, required: true},
    area: { type: String, required: true},
    city: { type: String, required: true},
    pin: { type: Number, required: true},
    items: { type : Array , "default" : [] },
    paymentType: { type: String, default: 'COD'},
    paymentStatus: {type: Boolean, default: false},
    status: { type: String, default: 'order_placed'},
},{timestamps: true})

const Order = new mongoose.model('Order', orderSchema)

module.exports = Order