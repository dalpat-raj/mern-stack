import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
import {initStripe} from './stripe'
import moment from 'moment'
import {quantityPm} from './Quantity'


let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')



function updateCart(pizza){
    axios.post(`/cart/add/${pizza.slug}`, pizza).then(function (res){
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
initStripe()

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


// remove alert messages after x second
const alerMsg = document.querySelector('#success-alert')
if(alerMsg){
    setTimeout(() => {
        alerMsg.remove()
    }, 2000);
}


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

// Quantity increase and decrease 
quantityPm();






 


