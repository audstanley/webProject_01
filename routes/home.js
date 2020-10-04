const express = require('express');
const { route } = require('./register');
const router = express.Router();

router.route('')
    .get((req, res) => {
        res.render('home', { data : "no data yet" } );
    });


module.exports = router;