const nanoid = require('nanoid')

module.exports = class DomainController {
  constructor() {
    this._pubSub = new PubSub()

    this._gameList = {
      games: {},
    }
  }

  async start() {}

  async stop() {}

  async dispatch({ name, params }) {
    let result
    while (true) {
      const method = this[name]
      if (!method) throw new Error('No controller method "' + name + '"')
      result = method.call(this, params)
      if (!result.nextQuery) break
      name = result.nextQuery.name
      params = result.nextQuery.params
    }
    return result
  }

  startGame({ secret }) {
    const gameId = nanoid()
    this._gameList.games[gameId] = {
      gameId,
      wordLength: secret.length,
      gameState: 'Waiting for breaker',
      guessList: [],
      gameVersion: 0,
    }

    this._pubSub.publish()
    return this._redirectToShowMakerGame(gameId)
  }

  joinGame() {
    for (const gameId of Object.keys(this._gameList.games)) {
      const game = this._gameList.games[gameId]
      if (game.gameState === 'Waiting for breaker') {
        game.gameState = 'Waiting for guess'
        game.gameVersion++
        this._pubSub.publish()
        return this._redirectToShowBreakerGame(gameId)
      }
    }
    throw new Error('No game to join!')
  }

  guess({ gameId, guess }) {
    const game = this._gameList.games[gameId]

    if (guess.length !== game.wordLength) {
      return this.showBreakerGame({
        gameId,
        errorMessage: `Guess must have ${game.wordLength} letters`,
      })
    }
    game.guessList.push({ guess })
    game.gameState = 'Waiting for score'
    game.gameVersion++
    this._pubSub.publish()
    return this._redirectToShowBreakerGame(gameId)
  }

  score({ gameId, points }) {
    const game = this._gameList.games[gameId]

    game.guessList[game.guessList.length - 1].points = points
    game.gameState = 'Waiting for guess'
    game.gameVersion++
    this._pubSub.publish()
    return this._redirectToShowMakerGame(gameId)
  }

  scoreCorrect({ gameId }) {
    const game = this._gameList.games[gameId]

    game.guessList[game.guessList.length - 1].points = game.wordLength
    game.gameState = 'Game over'
    game.gameVersion++
    this._pubSub.publish()
    return this._redirectToShowMakerGame(gameId)
  }

  showMakerGame({ gameId, errorMessage }) {
    const getData = () =>
      Object.assign({}, this._gameList.games[gameId], { errorMessage })

    return {
      view: 'showMakerGame',
      data: getData(),
      subscribe: fn => this._pubSub.subscribe(() => fn({ data: getData() })),
    }
  }

  showBreakerGame({ gameId, errorMessage }) {
    const getData = () =>
      Object.assign({}, this._gameList.games[gameId], { errorMessage })

    return {
      view: 'showBreakerGame',
      data: getData(),
      subscribe: fn => this._pubSub.subscribe(() => fn({ data: getData() })),
    }
  }

  _redirectToShowMakerGame(gameId) {
    return { nextQuery: { name: 'showMakerGame', params: { gameId } } }
  }

  _redirectToShowBreakerGame(gameId) {
    return { nextQuery: { name: 'showBreakerGame', params: { gameId } } }
  }
}

class PubSub {
  constructor() {
    this._callbacks = []
  }

  subscribe(callback) {
    this._callbacks.push(callback)
  }

  publish() {
    for (const callback of this._callbacks) {
      callback()
    }
  }
}
