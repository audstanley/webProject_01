const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    // expires after half and hour (1800 seconds = 30 minutes)
    let token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '30m' });
    return token;
}

module.exports = { generateAccessToken };