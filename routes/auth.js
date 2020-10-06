const jwt = require("jsonwebtoken");
const db = require('diskdb');
const { all } = require("./register");

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

module.exports = { generateAccessToken };