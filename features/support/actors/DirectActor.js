const BaseActor = require('../extract/BaseActor')

module.exports = class DirectActor extends BaseActor {
  constructor(name, sub, codebreaker) {
    super(name, sub)
    this._codebreaker = codebreaker
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
