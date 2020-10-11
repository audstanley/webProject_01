const jwt = require("jsonwebtoken");
const db = require('diskdb');

function generateAccessToken({username}) {
    // expires after half and hour (1800 seconds = 30 minutes)
    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        username: username,
    }, process.env.TOKEN_SECRET);
    console.log(`TOKEN CREATED: ${token}`);
    return token;
}

function deleteExpitedTokens() {
    setInterval(() => {
        db.connect('./data', ['refreshTokens']);
        let allTokens = db.refreshTokens.find();
        let tokensToDelete = allTokens.map(e => {
            jwt.verify(e.refreshToken, process.env.TOKEN_SECRET, (err, data) => {
                if(data.exp < Date.now() / 1000) {
                    db.refreshTokens.remove({ _id: e._id });
                }
            });
        });
    },1000 * 60 * 10);
}

deleteExpitedTokens();

// middleware that makes sure the user is loggedIn.
const jwtMiddleware = async (req, res, next) => {
    db.connect('./data', ['refreshTokens', 'users']);
    const refreshToken = req.cookies["Authorization: Bearer"];
    const tokenFromDb = db.refreshTokens.findOne({ refreshToken: refreshToken });
    if(tokenFromDb) {
        jwt.verify(tokenFromDb.refreshToken, process.env.TOKEN_SECRET, (err, decoded) => {
            console.log(err);
            if (err)  {
                req.loggedIn = false;
                next();
            } else {
                let user = db.users.findOne( { email: decoded.username } );
                if (user) {
                    console.log(`USER LOGGED IN: ${JSON.stringify(user)}`)
                    req.loggedIn = true;
                    req.emailAddress = decoded.username;
                    req.admim = user.admin;
                    req.firstName = user.firstName;
                    req.lastName = user.lastName;
                    req._id = user._id;
                    req.token  = tokenFromDb.refreshToken;
                    next();
                } else {
                    next();
                }
            }
          });
    } else {
        return res.render('home', { loggedIn: false });
    }
} 

module.exports = { generateAccessToken, jwtMiddleware };