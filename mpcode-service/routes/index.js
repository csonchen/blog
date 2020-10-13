const express = require('express');
const { getAccessToken, getMpCode } = require('../public/javascripts/api/codeService');
const router = express.Router();
const { appid, secret } = require('../config');

(async () => {
  const accessToken = await getAccessToken(appid, secret)
  const imgBuffer = await getMpCode(accessToken)
  const base64Img = Buffer.from(imgBuffer).toString('base64')
})()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Madatsara' });
});

module.exports = router;
