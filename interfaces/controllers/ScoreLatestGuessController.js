module.exports = class ScoreLatestGuessController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async scoreLatestGuess({ gameId, points }) {
    const game = await this._gameStore.getGameById(gameId);
    game.scoreLatestGuess(points);
    await this._gameStore.storeGame(game);
    return {
      description: "score received"
    };
  }
};
