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
        console.log(req)
        const { email, firstName, lastName, password, confirmPassword } = req.body;
        // Check if the password and confirm password fields match
        if (password === confirmPassword) {
            db.connect('./data', ['users']);
            const dbUser = db.users.find( { email: email }); // will return an array of users.
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
                db.users.save({ email: email, firstName: firstName, lastName: lastName, password: password });
                res.render('register', {
                    message: 'Created',
                    messageClass: 'alert-danger'
                });
            }
        }
    });

module.exports = router;