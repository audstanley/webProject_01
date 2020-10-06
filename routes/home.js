const express = require('express');
const { route } = require('./register');
const jwt = require("jsonwebtoken");
const db = require('diskdb');
const router = express.Router();

router.route('')
    .get((req, res) => {
        //console.log(`user: ${req.user}`);
        const refreshToken = req.cookies["Authorization: Bearer"];
        db.connect('./data', ['refreshTokens']);
        const tokenFromDb = db.refreshTokens.findOne({ refreshToken: refreshToken});
        if(tokenFromDb) {
            jwt.verify(tokenFromDb.refreshToken, process.env.TOKEN_SECRET, (err, decoded) => {
                console.log(err);
                if (err)  {
                    return res.render('home', { loggedIn: false });
                } else {
                    console.log(`USER VERIFIED ${JSON.stringify(decoded)}`);
                    return res.render('home', { loggedIn: true, username: decoded.username });
                }
              });
        } else {
            console.log('fresh home page');
            return res.render('home', { loggedIn: false });
        }
    });

module.exports = router;