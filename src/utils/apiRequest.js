import axios from 'axios'

function headers() {
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  }
}


const request = (callback) => {
  return new Promise((resolve, reject) => {
    callback
      .then(data => resolve(data))
      .catch(e => reject(handleError(e)));
  })
}

const handleError = (e) => {
  if (!e.response) return {_e: 'Unknown Error'};
  if (e.response.status !== 400) return {_e: e.response.statusText}
  const edata = e.response.data
  return typeof edata !== 'object' || Object.values(edata).filter(v => !Array.isArray(v)).length > 0
    ? {_e: 'Unknown server response'}
    : e.response.data
}

export default class apiRequest {
  static get(path) {
    return request(axios.get(`${path}`, headers()));
  }
}
