const express = require('express');
const { route } = require('./register');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require('./auth');

// will change with diskDb.
let refreshTokens = [];

// setInterval(() => {
//     console.log(`refreshTokens: ${refreshTokens}`)
// },10000);

router.route('/login')
    .post((req, res) => {
        const username = req.body.username;
        const user = { username: username };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken });

    });

// here is anouther route that you would find at localhost:3000/example/test
router.route('/')
    .get((req, res) => {
        const token = generateAccessToken({ username: req.body.username });
        res.send(token);
    });


router.route('/token')
    .post((req, res) => {
        const refreshToken = req.body.token; 
        if(refreshToken == null) return res.sendStatus(401);
        if(!refreshTokens.includes(refreshToken)) res.sendStatus(403);
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, username) => {
            if(err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ username: username });
            res.json({accessToken: accessToken});
        })
    })

module.exports = router;