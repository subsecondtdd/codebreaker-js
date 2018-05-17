if(typeof EventSource === 'undefined') {
  global.EventSource = require('eventsource')
}
if(typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

module.exports = class HTTPSession {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl
    this._result = {}
  }

  start() {
    return new Promise(( resolve, reject ) => {
      const es = new EventSource(this._url('/api/sse'))
      es.onerror = (errorEvent) => reject(errorEvent.error)
      es.addEventListener('connectionId', e => {
        this._connectionId = e.data
        resolve()
      })
      es.addEventListener('gameChanged', e => {
        this._result = JSON.parse(e.data)
      })
    })
  }

  async dispatchCommand({name, params}) {
    switch (name) {
      case 'startGame': {
        const res = await this.post('/api/games', params)
        this._result = await res.json()
        break
      }
      case 'joinGame': {
        const res = await this.post('/api/games/1234/breaker', params)
        this._result = await res.json()
        break
      }
      case 'guess': {
        const res = await this.post('/api/games/1234/guesses', params)
        this._result = await res.json()
        break
      }
      case 'score': {
        const res = await this.post('/api/games/1234/scores', params)
        this._result = await res.json()
        break
      }
      default:
        throw new Error(`Unknown command: ${name}`)
    }
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
      'Accept': 'application/json',
      'X-Connection-Id': this._connectionId,
    }
    const res = await fetch(url, {
      method: 'post',
      headers,
      body
    })
    if (res.status > 400)
      throw new Error(`${res.redirected ? 'GET' : 'POST'} ${res.url} - ${res.status}: ${await res.text()}`)
    return res
  }

  async get(path) {
    const url = this._url(path)
    const res = await fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Connection-Id': this._connectionId,
      }
    })
    if (res.status > 400)
      throw new Error(`GET ${res.url} - ${res.status}: ${await res.text()}`)
    return res
  }

  _url(path) {
    return `${this._baseUrl}${path}`
  }
}