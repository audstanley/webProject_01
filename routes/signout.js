const express = require('express');
const router = express.Router();
const db = require('diskdb');


router.route('')
    .get((req, res) => {
        db.connect('./data', ['refreshTokens']);
        res.cookie('Authorization: Bearer','');
        res.redirect('/home');
    });

module.exports = router;