const dotenv = require('dotenv');
const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const register = require('./routes/register');
const home = require('./routes/home');
const admin = require('./routes/admin');
const deleteRoute = require('./routes/delete');
const login = require('./routes/login');
const signout = require('./routes/signout');
const exampleRoute = require('./routes/exampleRoute');
const cors = require('cors');
const app = express();
const { backedUpFiles } = require('./fresh');
backedUpFiles()
    .then(() => {
        console.log(`cleaned up the ./data directory.`);
    });
dotenv.config(); // get the .env variables

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// for allowing cross site scripting
app.use(cors({
    origin: '*'
}));


// if there is a .env file and a SERVER_URL variable in the file (for the site's links), else use localhost:3000.
app.locals.SERVER_URL = (process.env.PORT)? 
    `http://localhost:${process.env.PORT || 3000}` 
    : process.env.SERVER_URL || `http://localhost:3000`; // how to make global variables that handlebars can use.
// using the handlebars templating engine
console.log(`SERVER_URL: ${app.locals.SERVER_URL}`);
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

// routes that we will create, import, and use in this index.js
app.use('/home', home);
app.use('/admin', admin);
app.use('/delete', deleteRoute);
app.use('/register', register);
app.use('/login', login);
app.use('/signout', signout);
app.use('/example', exampleRoute); // how a route works. look at the routes/exampleRoute.js 




app.listen(process.env.PORT || 3000);