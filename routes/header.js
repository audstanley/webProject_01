const express = require('express');
const router = express.Router();

router.route('')
    .get((req, res) => {
        res.render('header', { data : "someData" });
    });


module.exports = router;