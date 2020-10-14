const express = require('express');
const { route } = require('./register');
const jwt = require("jsonwebtoken");
const db = require('diskdb');
const router = express.Router();
const { jwtMiddleware } = require('./auth'); 

router.use(jwtMiddleware);

router.get('', (req, res) => {
        if(req.loggedIn) {
            db.connect('./data', ['users', 'photos']);
            const allUsers = db.users.find( { email: req.emailAddress });
            const userPhotos = db.photos.find( { email: req.emailAddress } );
            return res.render('home', { 
                loggedIn: true, 
                username: req.emailAddress, 
                allUsers: allUsers,
                userPhotos: userPhotos,
                _id: req._id,
                token: req.token
            });
        } else {
            return res.render('home', { loggedIn: false });
        }
    });

module.exports = router;