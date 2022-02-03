const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type:String, required:true },
    lastName:  { type:String, required:true },
    email:     { type:String, required:true, unique: true },
    phone:     { type:Number, required:true },
    area:      { type:String, required:true },
    pin:       { type:Number, required:true },
    city:      { type:String, required:true },
    state:     { type:String, required:true },
    password:  { type:String, required:true },
    role: { type:String, default: 'customer' }
},{timestamps: true})

const User = new mongoose.model('User', userSchema)

module.exports = User