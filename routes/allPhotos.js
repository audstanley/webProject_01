const express = require('express');
const db = require('diskdb');
const qrcode = require('qrcode');
const router = express.Router();

router.get('', async (req, res) => {
    db.connect('./data', ['users', 'photos']);
    const userPhotos = db.photos.find();
    const codes = await qrcode.toDataURL('blahblahblah');
    const userPhotosWithQR = await Promise.all(userPhotos.map(async e => {
        e.qr = await qrcode.toDataURL(e.u_id);
        return e;
    }));
    console.log(userPhotosWithQR);
    return res.render('allPhotos', {
        allPhotos: userPhotosWithQR,
    });
});

module.exports = router;