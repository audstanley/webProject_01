const express = require('express');
const router = express.Router();
const db = require('diskdb');

// this will look for the views/layouts/main.hbs
// then the views/register.hbs
router.route('')
    .get((req, res) => { 
        res.render('register');
    })
    .post((req, res) => {
        const { email, firstName, lastName, password, confirmPassword } = req.body;
        // Check if the password and confirm password fields match
        if (password === confirmPassword) {
            db.connect('./data', ['users']);
            const dbUser = db.users.find( { email: email }); // will return an array of users.
            const numberOfUsers = db.users.find().length;
            console.log(`/register Create User: ${dbUser.length}`);
            console.log(`/register User email: ${email}`);
            // Check if user with the same email is also registered (check the array that there is one user)
            if (dbUser.length > 0) {
                res.render('register', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                });
                return;
            } else {
                if (numberOfUsers == 0) {
                    db.users.save({ email: email, firstName: firstName, lastName: lastName, password: password, admin: true });
                } else {
                    db.users.save({ email: email, firstName: firstName, lastName: lastName, password: password, admin: false });
                }
                res.render('register', {
                    message: 'Successfully Created',
                    messageClass: 'alert-danger',
                    signin: true
                });
            }
        }
    });

module.exports = router;