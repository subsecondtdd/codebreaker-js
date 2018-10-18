const BaseActor = require('./BaseActor')

module.exports = class DirectActor extends BaseActor {
  constructor(name, codebreaker, pubSub) {
    super(pubSub)
    this._name = name
    this._codebreaker = codebreaker
  }

  getName() {
    return this._name
  }

  // Domain-specific logic goes here...

  async joinGameCreatedBy(makerName) {
    const games = await this._codebreaker.getGames()
    const game = games.find(game => game.makerName === makerName)
    await this._codebreaker.startGame(game.id, this._name)
    this._currentGame = game
  }

  getCurrentGameLetterCount() {
    return this._currentGame.letterCount
  }
}
