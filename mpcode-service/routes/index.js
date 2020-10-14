const express = require('express');
const { getAccessToken, getMpCode } = require('../public/javascripts/api/codeService');
const router = express.Router();
const { appid, secret } = require('../config');
const fs = require('fs');

(async () => {
  const accessToken = await getAccessToken(appid, secret)
  const reqImgData = await getMpCode(accessToken)
  const imgBuffer = Buffer.from(reqImgData, 'utf8')
  // const base64Img = Buffer.from(imgBuffer).toString('base64')
  fs.writeFile('./mpcode-service/public/1.jpeg', imgBuffer.toString(), (err) => {
    if (err) {
      console.error(err)
    }
  })
})()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Madatsara' });
});

module.exports = router;
