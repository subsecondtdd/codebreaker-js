module.exports = class HTTPSession {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl
    this._result = {}
  }

  async dispatchCommand({name, params}) {
    let res = await this.post('/api/games', params)
    while(res.status === 303) {
      res = await this.get(res.headers.location)
    }
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
    if (res.status !== 201)
      throw new Error(`POST ${url} - ${res.status}: ${await res.text()}`)
    return res.json()
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
      throw new Error(`GET ${url} - ${res.status}: ${await res.text()}`)
    return res.json()
  }

  _url(path) {
    return `${this._baseUrl}${path}`
  }
}