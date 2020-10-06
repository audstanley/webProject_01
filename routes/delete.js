const express = require('express');
const router = express.Router();
const db = require('diskdb');
const { route } = require('./register');

router.route('/:_id')
    .get((req, res) => {
        db.connect('./data', ['users']);
        db.users.remove({ _id: req.params._id });
        res.redirect(`${process.env.SERVER_URL}/admin`);
    });


module.exports = router;