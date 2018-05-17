module.exports = class HttpSession {
  constructor({baseUrl}) {
    // if (baseUrl === undefined) throw new Error('Missing baseUrl')
    this._baseUrl = baseUrl
  }

  dispatchCommand({name, params}) {
    switch (name) {
      case 'startGame':
        return this.post('/games', params)
      default:
        throw new Error(`Unsupported command: ${name}`)
    }
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
    const baseUrl = (typeof this._baseUrl === 'function') ? this._baseUrl() : this._baseUrl
    return `${baseUrl}${path}`
  }
}