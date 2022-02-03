import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiService'


async function initStripe() {
    const stripe = await loadStripe('pk_test_51KOzOJKH6F09BQmiNG9uAknFllcMVkPpCvXDdFfnZcgxMwVoAJ3j0OMER2gANMCCCd5Xwhpk9Dqzc537u1ZAhFFa00Z72yu0V8');

    let card = null;
    function mountWidget() {
    const elements = stripe.elements()
    let style = {
        base: {
            color: '32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };
    card = elements.create('card', {style, hidePostalCode: true})
    card.mount('#card-element')
   }

    const paymentType = document.querySelector('#paymentType')
    if(!paymentType){
        return;
    }
    paymentType.addEventListener('change', (e)=>{
        if(e.target.value === 'card'){
            // display widght
            mountWidget()
        }else{
            card.destroy()
        }
    })



// ajax call 
const paymentForm = document.querySelector('#payment-form')
if(paymentForm){
    paymentForm.addEventListener('submit', (e)=>{
        e.preventDefault()   
        let formData = new FormData(paymentForm);
        let formObject = {}

        for(let [key, value] of formData.entries()){
            formObject[key] = value
        }

        if(!card){
            // ajax call 
            placeOrder()
            return;
        }
        
        // verify card 
        stripe.createToken(card).then((result)=>{
            formObject.stripeToken = result.token.id;
            placeOrder(formObject)
        }).catch((err)=>{
            console.log(err);
        })
        
    
    })
}

}


export {initStripe}