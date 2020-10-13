const axios = require('axios');

const postData = (url, requestData = {}) => {
  const { data, params, method = 'get' } = requestData
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
      params,
    }).then(res => {
      const { errcode = 0, errmsg } = res.data
      if (errcode === 0) {
        resolve(res.data)
      } else {
        console.error({ message: errmsg })
      }
    }).catch(({ message }) => {
      console.error({ message })
    })
  })
}

module.exports = {
  postData,
}