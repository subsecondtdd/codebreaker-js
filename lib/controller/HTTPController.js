/**
 * Client-side controller. Translates commands to HTTP requests.
 * Handles server-sent events for push updates.
 */
module.exports = class HTTPController {
  constructor({baseUrl, EventSource, fetch}) {
    this._baseUrl = baseUrl
    this._EventSource = EventSource
    this._fetch = fetch
  }

  start() {
    // Wait for the EventSource to be connected and receive the first
    // connectionId message. We pass this connectionId with every HTTP request
    // so the server can correlate requests
    return new Promise((resolve, reject) => {
      const es = new this._EventSource(this._url('/api/sse'))
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
        const res = await this._post(`/api/games/${params.gameId}/breaker`, params)
        return this._result(res)
      }
      case 'guess': {
        const res = await this._post(`/api/games/${params.gameId}/guesses`, params)
        return this._result(res)
      }
      case 'score': {
        const res = await this._post(`/api/games/${params.gameId}/scores`, params)
        return this._result(res)
      }
      case 'scoreCorrect': {
        const res = await this._post(`/api/games/${params.gameId}/end`, params)
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
          if (this._es.readyState === EventSource.OPEN) {
            this._es.addEventListener('gameChanged', e => {
              const result = JSON.parse(e.data, reviver)
              fn(result)
            })
          }
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
    const res = await this._fetch(url, {
      method: 'post',
      headers,
      body
    })

    if (res.status > 400)
      throw new Error(`${res.redirected ? 'GET' : 'POST'} ${res.url} - ${res.status}: ${await res.text()}`)
    return res
  }

  _url(path) {
    return `${this._baseUrl}${path}`
  }
}