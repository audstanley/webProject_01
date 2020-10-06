const express = require('express');
const router = express.Router();
const db = require('diskdb');
const jwt = require("jsonwebtoken");

router.route('')
    .get((req,res) => {
        const refreshToken = req.cookies["Authorization: Bearer"];
        db.connect('./data', ['refreshTokens', 'users']);
        const tokenFromDb = db.refreshTokens.findOne({ refreshToken: refreshToken});
        if(tokenFromDb) {
            jwt.verify(tokenFromDb.refreshToken, process.env.TOKEN_SECRET, (err, decoded) => {
                console.log(err);
                if (err)  {
                    return res.render('home', { loggedIn: false });
                } else {
                    const allusers = db.users.find();
                    const admin = allusers.filter(e => e.email === decoded.username);
                    const deletableUsers = allusers.filter(e => !e.admin);
                    console.log(`1: ${JSON.stringify(allusers)} 2: ${JSON.stringify(admin)} 3: ${deletableUsers}`);
                    if(admin && admin[0].admin) {
                        return res.render('admin', { 
                            loggedIn: true, 
                            username: decoded.username, 
                            admin: true,
                            deletableUsers: deletableUsers
                        });
                    }
                    return res.render('home', { loggedIn: true, username: decoded.username });
                }
              });
        } else {
            console.log('fresh home page');
            return res.render('admin', { loggedIn: false });
        }
    });

module.exports = router;