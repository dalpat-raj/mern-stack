import axios from 'axios'
let pices = document.querySelectorAll('#pices')
let totalamount = document.querySelector('#totalamount')
let price = document.querySelectorAll('#price')


function quantityPm(){

    //  quantity increase function
function plusqty(pizza){
    axios.post(`/cart/add/${pizza.title}` , pizza).then(function (res){
        let dataid = JSON.parse(res.config.data)
        pices.forEach((showw)=>{
        if(dataid.title == showw.dataset.id){
        showw.innerText = `${res.data.itemQty}`
        totalamount.innerText = `₹ ${res.data.totalPrice}`
    } 
})
    
price.forEach((price)=>{
    if(dataid.title == price.dataset.id){
        price.innerText = `₹ ${res.data.itemPrice}`
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
        plusqty(pizza);

    })
})


// decrese function
function minusqty(pizza){
    axios.post(`/cart/minus/${pizza.title}`, pizza).then(function (res){
        let dataid = JSON.parse(res.config.data)
        pices.forEach((showw)=>{
            if(dataid.title == showw.dataset.id){
                showw.innerText = `${res.data.item_Qty}`
                totalamount.innerText = `₹ ${res.data.totalpp}`
            } 
        })
    
        price.forEach((price)=>{
            if(dataid.title == price.dataset.id){
                price.innerText = `₹ ${res.data.item_Price}` 
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
        minusqty(pizza);
    })
})

}

export {quantityPm}