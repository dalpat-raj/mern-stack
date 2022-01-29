import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let pices = document.querySelectorAll('#pices')
let totalamount = document.querySelector('#totalamount')
let price = document.querySelectorAll('#price')


function updateCart(pizza){
    axios.post('/updatecart', pizza).then(function (res){
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart'
        }).show();
    }).catch(function (err){
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza);
    })
})

//  quantity increase function
function plusqty(pizza){
    axios.post('/updatecart', pizza).then(function (res){
        cartCounter.innerText = res.data.totalQty
        // console.log(res);
        let dataid = JSON.parse(res.config.data)
        pices.forEach((showw)=>{
        if(dataid._id == showw.dataset.id){
        showw.innerText = `${res.data.Qty}`
        totalamount.innerText = `₹ ${res.data.totalPrice}`
    } 
})
    
price.forEach((price)=>{
    if(dataid._id == price.dataset.id){
        price.innerText = `₹ ${res.data.price * res.data.Qty}` 
    }
})


        
    }).catch(function (err){
     console.log('rong');
    })
}

//  quantity increase button
const carthide = document.querySelectorAll('.carthide')
carthide.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        pizza = pizza.item
        plusqty(pizza);

    })
})
function minusqty(pizza){
    axios.post('/minusqty', pizza).then(function (res){
        cartCounter.innerText = res.data.totalQty
        // console.log(res);
        let dataid = JSON.parse(res.config.data)
        pices.forEach((showw)=>{
            if(dataid._id == showw.dataset.id){
                showw.innerText = `${res.data.Qty}`
                totalamount.innerText = `₹ ${res.data.totalPrice}`
            } 
        })
    
        price.forEach((price)=>{
            if(dataid._id == price.dataset.id){
                price.innerText = `₹ ${res.data.price * res.data.Qty}` 
            }
        })
 
    }).catch(function (err){
     console.log('rong');
    }) 
}

// quantity minus button
const cartminus = document.querySelectorAll('.cartminus')
cartminus.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        pizza = pizza.item
        minusqty(pizza);

    })
})


// remove alert messages after x second
const alerMsg = document.querySelector('#success-alert')
if(alerMsg){
    setTimeout(() => {
        alerMsg.remove()
    }, 2000);
}



// change order status
const statuses = document.querySelectorAll('.status_line')
const hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)


// socket.io 
let socket = io()


// join
if(order){
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        text: 'order updated'
    }).show();
})




// toggle
const humbger = document.getElementById('humbger')
const navbarr = document.querySelector('.navbarr')
const menuclose = document.querySelector('.menu-close') 
humbger.addEventListener('click', (e)=> {
    navbarr.style.top = "0";
    menuclose.style.display = 'block'
    humbger.style.display = 'none'
})

menuclose.addEventListener('click', ()=>{
    navbarr.style.top = "-450px";
    menuclose.style.display = 'none'
    humbger.style.display = 'block'
})

