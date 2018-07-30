const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
// Require the user 
const User = require('../../models/User');
const keys = require('../../config/keys');

// @route GET api/users/test
// @desc Tests the users route
// @acess Public
// @returns a 200 and simple user works messages
router.get('/test', (req, res) => {
    res.status('200').json('the user endpoint works')
})

// @route POST api/users/register
// @desc registers a user
// @acess Public
// @returns 409 conflict the request could not be completed due to a conflict with the current state of the resource
// @returns 201 for a new user sucesfully created
// @returns 500 some db save error 

router.post('/register', (req, res) => {
    // deconstruct values from body 
    const { email, name, password } = req.body
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(409).json({ email: 'email already registered' });
            } else {
                const avatar = gravatar.url(email, {
                    s: '200', //the size
                    r: 'pg', //rating 
                    d: 'mm' //default
                });
                //es6 short hand for name:name, email:email etc.
                const newUser = new User({
                    name,
                    email,
                    avatar,
                    password
                });
                newUser.save()
                    .then(user => res.status(201).json(user))
                    .catch(err => {
                        console.log(err)
                        res.status('500').json({ db: 'an error has occured in saving in the db' })
                    });
            }
        });
});

// @route post api/users/login
// @desc logins a guest
// @acess Public
// @returns 404 when a user is not found 
// @returns 400 when a password is incorrect 
// @returns 200 when a user is sucessfully logged in with a bearer token
// @returns 500 incase of any errors

router.post('/login', (req, res) => {
    const { email, password } = req.body
    //short hand for email:email
    User.findOne({ email })
        .then(user => {
            //check for user 
            if (!user) {
                return res.status(404).json({ user: 'User not found' });
            }
            user.comparePassword(password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, name: user.name, avatar: user.avatar } // created JWT payload
                        jwt.sign(
                            payload,
                            keys.secretOrPrivateKey,
                            { algorithm: 'RS256'},
                            { expiresIn: 7200 },
                            (err, token) => {
                                res.json({
                                    sucess: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status('500').json({ login: 'an error has occured in the login process' })
                });

        });
});

module.exports = router;