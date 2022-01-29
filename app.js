require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const port = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

// database connection 
const url = 'mongodb://localhost/pizza';   // local mongodb compass
// const url = process.env.MY_URL
mongoose.connect(url).then(()=>{
    console.log('DataBase Connection succesfull');
}).catch((err)=>{
    console.log(err);
})

// session store 
let store = new MongoDbStore({
    mongoUrl: url,
    collection: "sessions"
 });

// event emiter 
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// session config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: store,
        unset: 'destroy',
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    })
);

// passport config 
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());



app.use(flash())

// asset 
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// global middleware 
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// set templetes engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


// routes
require('./routes/web')(app)



const server = app.listen(port, ()=>{
    console.log(`Listing on port ${port}`);
})


//  socket.io

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // join 
    socket.on('join', (orderId)=>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})