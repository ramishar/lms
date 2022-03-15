const axios = require('axios');

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', email: '', contact: '', password: ''}
    if(err.message === 'incorrect email') {
        errors.email = 'That email is not registered!';
    }
    if(err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    if(err.code == 11000) {
        errors.email = 'That user is already registered';
        return errors;
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'learning secret', {
    expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}
  
module.exports.login_get = (req, res) => {
   res.render('login');
}

module.exports.update_load = async(req,res) => {
        const id = req.query.id;
        const userData = await User.findById(id);
        if(userData) {
            res.render('update_profile', {user: userData.data})
        }
        
}

module.exports.update_profile = async(req,res) => {
    const id = req.params.id;
    try {
        User.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
         .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        
    } catch (error) {
        console.log(error.message);
    }
}
  
module.exports.signup_post = async (req, res) => {
    const { username, fullname, email, contact, password, profile_photo } = req.body;
    try {
        const user = await User.create({username, fullname, email, contact, password, profile_photo});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
  
// module.exports.login_post = async (req, res) => {
//     // const email = req.body.email;
//     // const password = req.body.password;
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         // const user = await User.login({email, password});
//         const token = createToken(user._id);
//         res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });
//         res.status(200).json({user: user._id});
//     } catch (err) {
//         const errors = handleErrors(err);
//         res.status(400).json({errors});
//     }
// }

module.exports.login_post = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {  
        const auth = await bcrypt.compare(req.body.password, user.password);
        const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });
         res.status(200).json({user: user._id});
        if (auth) {
           return user;
        }
        throw Error('Incorrect password');
        }
        throw Error('Incorrect email');
    };

    module.exports.courses_get = (req, res) => {
        res.render('courses');
     }

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});   //replace token value with blank value to logout
    res.redirect('/');
}