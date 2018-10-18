const nanoid = require('nanoid')

/**
 * The domain logic for the codebreaker game. This is the "inner hexagon" of the application -
 * it implements the services needed by the UI.
 *
 * All input and output is primitive types (strings, ints)
 */
module.exports = class Codebreaker {
  constructor(pubSub) {
    this._games = []
    this._pubSub = pubSub
    this._version = 0
  }

  getVersion() {
    return this._version
  }

  getGames() {
    return this._games.map(game => game.getInfo())
  }

  getGame(gameId) {
    const game = this._findGame(gameId)
    return game.getInfo()
  }

  async createGame(makerName, secret) {
    const game = new Game(makerName, secret, this._pubSub)
    this._games.push(game)
    await this._pubSub.publish('version', ++this._version)
  }

  async startGame(gameId, makerName) {
    const game = this._findGame(gameId)
    if(!game) throw new Error(`No such game: ${gameId}`)
    await game.start(makerName)
    await this._pubSub.publish('version', ++this._version)
  }

  _findGame(gameId) {
    return this._games.find(game => game._id === gameId)
  }
}

class Game {
  constructor(makerName, secret) {
    this._id = nanoid()
    this._breakerName = null
    this._makerName = makerName
    this._secret = secret
  }

  async start(breakerName) {
    this._breakerName = breakerName
  }

  getInfo() {
    return {
      id: this._id,
      makerName: this._makerName,
      breakerName: this._breakerName,
      letterCount: this._secret.length
    }
  }
}
