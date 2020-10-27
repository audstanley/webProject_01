const express = require('express');
const { route } = require('./register');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require('./auth');
const db = require('diskdb');

router.route('')
    .post((req, res) => {
        db.connect('./data', ['refreshTokens', 'users']);
        const { username, password } = req.body;
        console.log(`${username} ${password}`);
        const user = { username: username };
        const foundUser = db.users.findOne( { email: username, password: password } );
        if (foundUser) {
            console.log(`found user in db: ${JSON.stringify(foundUser)}`);
            const refreshToken = generateAccessToken(user);
            console.log(`login - refreshToken: ${refreshToken}`);
            db.refreshTokens.save({ refreshToken: refreshToken });
            res.cookie('Authorization: Bearer', refreshToken);
            res.redirect('/home');
        } else {
            res.redirect('/home');
        }
    });

// here is anouther route that you would find at localhost:3000/example/test
router.route('')
    .get((req, res) => {
        const token = generateAccessToken({ username: req.body.username });
        res.send(token);
    });


// router.route('/token')
//     .post((req, res) => {
//         const refreshToken = req.body.token; 
//         if(refreshToken == null) return res.sendStatus(401);
//         if(!refreshTokens.includes(refreshToken)) res.sendStatus(403);
//         jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, username) => {
//             if(err) return res.sendStatus(403);
//             const accessToken = generateAccessToken({ username: username });
//             res.json({accessToken: accessToken});
//         });
//     });

module.exports = router;