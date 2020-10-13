const { postData } = require("../utils/service")

const getAccessToken = (appid, secret) => {
  return new Promise((resolve, reject) => {
    postData('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        appid,
        secret,
        grant_type: 'client_credential'
      }
    }).then(({ access_token: accessToken })=> resolve(accessToken))
  })
}

const getMpCode = (accessToken) => {
  return new Promise((resolve, reject) => {
    postData('https://api.weixin.qq.com/wxa/getwxacode', {
      method: 'post',
      params: {
        access_token: accessToken,
      },
      data: {
        path: 'page/index/index',
        width: 430
      },
    }).then(resData => {
      resolve(resData)
    })
  })
}


module.exports = {
  getAccessToken,
  getMpCode,
}