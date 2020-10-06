const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers.authorization;
    const { username, password } = req.body;
    console.log(`req.headers: ${JSON.stringify(req.headers,null,2)}`);
    console.log(`{u: ${username}, p: ${password}}`)
    const token = authHeader && authHeader.split(' ')[1];
    console.log(`AUTH_TOKEN: ${token}`);
    if (token == null) {
        console.log(`UNAUTHORIZED`);
        return res.render('home', { loggedIn: false });
        //return res.sendStatus(401);
    } // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, err => {
      console.log(err);
      if (err) return res.sendStatus(403);
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });

}

function generateAccessToken(user) {
    // expires after half and hour (1800 seconds = 30 minutes)

    let token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '30m' });
    //console.log(`TOKEN: ${token}`);
    return token;
}

module.exports = { authenticateToken, generateAccessToken };