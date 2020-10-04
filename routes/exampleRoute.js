const express = require('express');
const { route } = require('./register');
const router = express.Router();

router.route('')
    .get((req, res) => {
        res.send("This example works!");
    });

// here is anouther route that you would find at localhost:3000/example/test
router.route('/test')
    .get((req, res) => {
        res.send("This test works!");
    });

module.exports = router;