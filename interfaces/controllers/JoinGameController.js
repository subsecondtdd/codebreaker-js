module.exports = class JoinGameController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async joinGame({ gameId }) {
    const game = await this._gameStore.getGameById(gameId);
    game.join();
    await this._gameStore.storeGame(game);
    return {
      stream: {
        emitter: this._gameStore.makeGameChangeEmitter({ gameId }),
        action: "playAsBreaker",
        params: { game }
      }
    };
  }
};
