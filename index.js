const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const register = require('./routes/register');
const exampleRoute = require('./routes/exampleRoute');
const coffeeorders = require('./routes/coffeeorders');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// for allowing cross site scripting
app.use(cors({
    origin: '*'
}));

// using the handlebars templating engine
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

// routes that we will create, import, and use in this index.js
app.use('/register', register);
app.use('/coffeeorders', coffeeorders);
app.use('/example', exampleRoute); // how a route works. look at the routes/exampleRoute.js 

 
app.listen(3000);