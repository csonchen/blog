export const postData = (url, data = {}) => {
  const { method = 'GET', params = {} } = data
  return fetch(url, {
    body: JSON.stringify(params),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method,
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer'
  })
  .then(response => response.json())
}