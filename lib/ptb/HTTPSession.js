module.exports = class HTTPSession {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl
    this._result = {}
  }

  async dispatchCommand({name, params}) {
    const res = await this.post('/api/games', params)
    this._result = await res.json()
  }

  getTestView(name) {
    return this._result[name]
  }

  async post(path, bodyObject) {
    const url = this._url(path)
    let contentType, body
    if (!bodyObject || typeof bodyObject === 'string') {
      contentType = 'text/plain'
      body = bodyObject || ''
    } else {
      contentType = 'application/json'
      body = JSON.stringify(bodyObject)
    }

    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json'
    }
    const res = await fetch(url, {
      method: 'post',
      headers,
      body
    })
    if (res.status >= 400)
      throw new Error(`${res.redirected ? 'GET' : 'POST'} ${res.url} - ${res.status}: ${await res.text()}`)
    return res
  }

  async get(path) {
    const url = this._url(path)
    const res = await fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    })
    if (res.status !== 200)
      throw new Error(`GET ${res.url} - ${res.status}: ${await res.text()}`)
    return res
  }

  _url(path) {
    return `${this._baseUrl}${path}`
  }
}