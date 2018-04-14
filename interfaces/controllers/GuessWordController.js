module.exports = class GuessWordController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async guessWord({ gameId, guess }) {
    const game = await this._gameStore.getGameById(gameId);
    game.guessWord({ guess });
    await this._gameStore.storeGame(game);
    return {
      description: "guess submitted"
    };
  }
};
