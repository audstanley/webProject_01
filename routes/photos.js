const express = require('express');
const multer  = require('multer');
const router = express.Router();
const db = require('diskdb')
const { jwtMiddleware } = require('./auth');
const formidable = require('formidable');
const fs = require('fs').promises;


// gives req.emailAddress and req.loggedIn to the request object.
router.use(jwtMiddleware);

router.post('/:token', (req, res) => { // this route will get ALLof the photos for a specific user (based on JWT).
        if(req.params.token === req.token) {
            db.connect('./data', ['photos']);
            new formidable.IncomingForm().parse(req)
                .on('file', async (name, file) => {
                    console.log(`${file}`)
                    const data = fs.readFile(file.path);
                    const b64 = (await data).toString('base64');
                    await fs.unlink(file.path);
                    db.photos.save({ email: req.emailAddress, u_id: req._id, b64: b64 });
                    res.redirect(`${process.env.SERVER_URL}/home`);
                })
                .on('error', (err) => {
                    console.log(err);
                });
        } else {
            res.status(401).json({"error": "forbidden"});
        }
});


module.exports = router;