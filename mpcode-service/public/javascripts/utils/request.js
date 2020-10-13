const postData = (url, data, method = 'GET') => {
  return fetch(url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method,
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(response => response.json())
}

module.exports = {
  postData,
}