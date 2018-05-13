module.exports = class GuessWordController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async guessWord({ gameId, guess }) {
    const game = await this._gameStore.getGameById(gameId);
    if (guess.length === game.wordLength) {
      game.guessWord({ guess });
      await this._gameStore.storeGame(game);
    }
    return {
      description: game.describeState()
    };
  }
};
