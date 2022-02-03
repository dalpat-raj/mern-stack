const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')


function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? 'admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next){
            const { email, password } = req.body 
            // validate request
            if(!email || !password){
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const {fname, lname, email, phone, area, pin, city, state, password, cpassword} = req.body 
            // validate request
            if( !fname || !lname || !email || !phone || !area || !pin || !city || !state || !password || !cpassword ){
                req.flash('error', 'All fields are required')
                req.flash('name', fname)
                req.flash('email', email)
                return res.redirect('/register')
            }
            if(password !== cpassword){
                req.flash('error', 'password not match')
                return res.redirect('/register')
            }
            if(city !== 'sirohi' && city !== 'Sirohi' && city !== 'SIROHI'){
                req.flash('error', 'only sirohi city')
                return res.redirect('/register')
            }
            // // check if email exists
            User.exists({email: email}, (err, result)=> {
                if(result){
                    req.flash('error', 'Email already taken')
                    req.flash('name', fname)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            // hash password 
            const hashedPassword = await bcrypt.hash(password, 10)

            // create user 
            const user = new User({
                firstName: fname,
                lastName: lname,
                email: email,
                phone: phone,
                area: area,
                pin: pin,
                city: city,
                state: state,
                password: hashedPassword
            })
            user.save().then((user)=>{
                // login
                return res.redirect('/login')
            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}


module.exports = authController