if (typeof EventSource === 'undefined') {
  global.EventSource = require('eventsource')
}
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

module.exports = class HTTPController {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl
  }

  start() {
    return new Promise((resolve, reject) => {
      const es = new EventSource(this._url('/api/sse'))
      es.onerror = (errorEvent) => {
        es.onerror = null
        reject(errorEvent.error)
      }
      es.addEventListener('connectionId', e => {
        this._connectionId = e.data
        resolve()
      })
      this._es = es
    })
  }

  async stop() {
    this._es.close()
  }

  async dispatch({name, params}) {
    switch (name) {
      case 'startGame': {
        const res = await this._post('/api/games', params)
        return this._result(res)
      }
      case 'joinGame': {
        const res = await this._post('/api/games/1234/breaker', params)
        return this._result(res)
      }
      case 'guess': {
        const res = await this._post('/api/games/1234/guesses', params)
        return this._result(res)
      }
      case 'score': {
        const res = await this._post('/api/games/1234/scores', params)
        return this._result(res)
      }
      case 'scoreCorrect': {
        const res = await this._post('/api/games/1234/end', params)
        return this._result(res)
      }
      default:
        throw new Error(`Unknown command: ${name}`)
    }
  }

  async _result(res) {
    const reviver = (key, value) => {
      if (key === 'subscribe' && value === true) {
        return fn => {
          this._es.addEventListener('gameChanged', e => {
            const result = JSON.parse(e.data, reviver)
            fn(result)
          })
        }
      }
      return value
    };
    return JSON.parse(await res.text(), reviver)
  }

  async _post(path, bodyObject) {
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

  async _get(path) {
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